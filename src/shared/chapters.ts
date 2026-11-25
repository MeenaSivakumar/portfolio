/**
 * The chapter list is the public contract between the core journey and anything
 * that wants to observe it (progress indicators, terminal `cd`, nav feedback…).
 * Each chapter owns one DOM anchor: an element with id={anchor} and data-chapter={id}.
 */
export type ChapterId =
  | 'intro'
  | 'mobile'
  | 'web'
  | 'projects'
  | 'achievements'
  | 'articles'
  | 'toolkit'
  | 'about'
  | 'contact';

export type JourneyObject = 'book' | 'phone' | 'laptop' | 'page';

export interface Chapter {
  id: ChapterId;
  label: string;
  /** Short index shown in indicators, e.g. "01" */
  index: string;
  anchor: string;
  /** Clean URL for this chapter, e.g. /projects (the intro is the site root) */
  path: string;
  /** Which storytelling object dominates this chapter */
  object: JourneyObject;
}

export const CHAPTERS: Chapter[] = [
  { id: 'intro', label: 'Intro', index: '01', anchor: 'intro', path: '/', object: 'book' },
  { id: 'mobile', label: 'Mobile', index: '02', anchor: 'mobile', path: '/mobile', object: 'phone' },
  { id: 'web', label: 'Web', index: '03', anchor: 'web', path: '/web', object: 'laptop' },
  { id: 'projects', label: 'Projects', index: '04', anchor: 'projects', path: '/projects', object: 'page' },
  { id: 'achievements', label: 'Achievements', index: '05', anchor: 'achievements', path: '/achievements', object: 'page' },
  { id: 'articles', label: 'Articles', index: '06', anchor: 'articles', path: '/articles', object: 'page' },
  // An index rather than a numbered chapter — the story's numbering (About 07, Contact 08) is unchanged.
  { id: 'toolkit', label: 'Toolkit', index: 'ix', anchor: 'toolkit', path: '/toolkit', object: 'page' },
  { id: 'about', label: 'About', index: '07', anchor: 'about', path: '/about', object: 'book' },
  { id: 'contact', label: 'Contact', index: '08', anchor: 'contact', path: '/contact', object: 'book' },
];

export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id);

/** '/projects', '/projects/', and (for the intro) '/' or '/index.html' → the chapter; anything else → undefined */
export function chapterByPath(pathname: string) {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/(.)\/+$/, '$1') || '/';
  return CHAPTERS.find((c) => c.path === clean);
}
