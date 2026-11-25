import { useEffect } from 'react';
import { CHAPTERS, chapterById, chapterByPath } from '../shared/chapters';
import { journeyBus } from '../shared/journeyBus';
import { scrollToChapter } from '../shared/scrollTo';

/**
 * Clean-path navigation for a single scrolling page.
 *
 *  - Links to /mobile, /projects… scroll to that chapter and push a history entry (no reload).
 *  - Opening a path directly (or reloading) lands on that chapter.
 *  - Back/Forward move between chapters.
 *  - While the visitor scrolls, the address bar follows the chapter in view (replaceState).
 *  - Legacy #anchor links are rewritten to their path.
 *
 * The host must serve index.html for these paths (see vercel.json / public/_redirects).
 */
export function useSectionRouting() {
  useEffect(() => {
    const isOurPage = () => !!chapterByPath(location.pathname);
    const pathOf = (id: string) => chapterById(id)?.path ?? '/';
    const withSearch = (path: string) => path + location.search;

    // While we scroll on purpose, don't let the scroll-sync overwrite the target URL.
    let steering = false;
    let steerTimer = 0;
    const release = () => {
      steering = false;
      window.clearTimeout(steerTimer);
    };
    const go = (id: string, behavior: ScrollBehavior) => {
      steering = true;
      window.clearTimeout(steerTimer);
      scrollToChapter(id, behavior);
      steerTimer = window.setTimeout(release, behavior === 'smooth' ? 2000 : 150);
    };

    // Initial location: legacy #hash, or a deep-linked path.
    const fromHash = location.hash ? CHAPTERS.find((c) => `#${c.anchor}` === location.hash) : undefined;
    const initial = fromHash ?? chapterByPath(location.pathname);
    if (fromHash) history.replaceState(history.state, '', withSearch(fromHash.path));
    if (initial && initial.id !== 'intro') {
      steering = true;
      // Let the journey size itself from the viewport before jumping.
      requestAnimationFrame(() => requestAnimationFrame(() => go(initial.id, 'auto')));
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const chapter = chapterByPath(url.pathname);
      if (!chapter || !isOurPage()) return;
      e.preventDefault();
      if (chapter.path !== location.pathname) history.pushState({ chapter: chapter.id }, '', withSearch(chapter.path));
      // Next frame: lets things like the mobile menu close (and release scroll lock) first.
      requestAnimationFrame(() => go(chapter.id, 'smooth'));
    };

    const onPop = () => {
      const chapter = chapterByPath(location.pathname);
      if (chapter) go(chapter.id, 'auto');
    };

    // Keep the address bar in step with the chapter in view.
    const unsubscribe = journeyBus.subscribe(() => {
      if (steering || !isOurPage()) return;
      const path = pathOf(journeyBus.get().chapter);
      if (path !== location.pathname) history.replaceState(history.state, '', withSearch(path));
    });

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    window.addEventListener('scrollend', release);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('scrollend', release);
      window.clearTimeout(steerTimer);
      unsubscribe();
    };
  }, []);
}
