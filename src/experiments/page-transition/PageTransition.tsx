import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, chapterByPath, type Chapter } from '../../shared/chapters';
import { reducedMotion } from '../_shared/env';
import type { VariantProps } from '../types';
import './page-transition.css';

const COVER_MS = 520;

export default function PageTransition({ variant }: VariantProps) {
  const [target, setTarget] = useState<Chapter | null>(null);
  const busy = useRef(false);
  /** url: what to put in the address bar after the jump (a clean path, or a #hash on pages without routing) */
  const pending = useRef<{ dest: HTMLElement; url: string; push: boolean } | null>(null);

  // Jump only once the cover has fully arrived, so the jump is never visible — even on slow frames.
  const onCovered = () => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    p.dest.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
    if (p.push) history.pushState({ chapter: true }, '', p.url);
    else history.replaceState(history.state, '', p.url);
    window.setTimeout(() => {
      setTarget(null);
      busy.current = false;
    }, variant === 'chapter-card' ? 380 : 80);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[data-fx-link]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      // Clean paths (/projects) on the portfolio, #anchors on pages without routing (the lab sandbox).
      let chapter: Chapter | undefined;
      let url = href;
      let push = false;
      if (href.startsWith('#')) {
        chapter = CHAPTERS.find((c) => c.anchor === href.slice(1));
      } else {
        const u = new URL(a.href, location.href);
        if (u.origin !== location.origin) return;
        chapter = chapterByPath(u.pathname);
        url = (chapter?.path ?? u.pathname) + location.search;
        push = !!chapter && chapter.path !== location.pathname;
      }
      const dest = chapter ? document.getElementById(chapter.anchor) : null;
      if (!chapter || !dest || reducedMotion() || busy.current) return;
      e.preventDefault();
      busy.current = true;
      pending.current = { dest, url, push };
      setTarget(chapter);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [variant]);

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {target && variant === 'wipe' && (
        <motion.div
          key="wipe"
          className="fx-pt fx-pt--wipe"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: COVER_MS / 1000, ease }}
          onAnimationComplete={onCovered}
          aria-hidden="true"
        />
      )}
      {target && variant === 'fade' && (
        <motion.div
          key="fade"
          className="fx-pt fx-pt--fade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: COVER_MS / 1000 }}
          onAnimationComplete={onCovered}
          aria-hidden="true"
        />
      )}
      {target && variant === 'chapter-card' && (
        <motion.div
          key="card"
          className="fx-pt fx-pt--card"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: COVER_MS / 1000, ease }}
          onAnimationComplete={onCovered}
          role="status"
        >
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} className="eyebrow">
            Chapter {target.index}
          </motion.span>
          <motion.strong initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}>
            {target.label}
          </motion.strong>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
