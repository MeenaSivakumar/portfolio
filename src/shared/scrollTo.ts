import { chapterById } from './chapters';

/** Scrolls to a chapter anchor. Works for core and experiments alike (DOM-level, no coupling). */
export function scrollToChapter(id: string, behavior: ScrollBehavior = 'smooth') {
  const chapter = chapterById(id);
  const el = document.getElementById(chapter ? chapter.anchor : id);
  if (!el) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'start' });
  return true;
}
