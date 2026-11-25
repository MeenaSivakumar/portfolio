import { content } from '../../content/content';
import { CHAPTERS } from '../../shared/chapters';
import { journeyBus } from '../../shared/journeyBus';
import { scrollToChapter } from '../../shared/scrollTo';

export type LineKind = 'in' | 'out' | 'err' | 'sys';
export interface Line {
  kind: LineKind;
  text: string;
}

export interface Ctx {
  history: string[];
  clear(): void;
  close(): void;
}

type Cmd = { help: string; run(args: string[], ctx: Ctx): string | string[] | void };

const chapterIds = CHAPTERS.map((c) => c.id);

export const COMMANDS: Record<string, Cmd> = {
  help: {
    help: 'list commands',
    run: () => Object.entries(COMMANDS).map(([k, c]) => `  ${k.padEnd(10)} ${c.help}`),
  },
  ls: {
    help: 'list chapters',
    run: () => CHAPTERS.map((c) => `  ${c.index}  ${c.id.padEnd(13)} ${c.object}`),
  },
  cd: {
    help: 'go to a chapter — cd projects',
    run: ([target]) => {
      if (!target) return 'usage: cd <chapter>   (try `ls`)';
      const id = target.replace(/^\.?\/?/, '').replace(/\/$/, '');
      if (id === '..' || id === '~') {
        scrollToChapter('intro');
        return 'back to page one';
      }
      if (!chapterIds.includes(id as never)) return `cd: no such chapter: ${target}`;
      scrollToChapter(id);
      return `→ ${id}`;
    },
  },
  pwd: {
    help: 'where am I?',
    run: () => {
      const s = journeyBus.get();
      return `/journey/${s.chapter}  (${Math.round(s.overall * 100)}% through)`;
    },
  },
  whoami: {
    help: 'about the author',
    run: () => [content.person.name, content.person.role, ...content.person.meta],
  },
  projects: {
    help: 'list projects',
    run: () => content.projects.map((p, i) => `  ${String(i + 1).padStart(2, '0')}  ${p.title.padEnd(24)} ${p.year}`),
  },
  articles: {
    help: 'list articles',
    run: () => content.articles.map((a) => `  • ${a.title}`),
  },
  contact: {
    help: 'how to reach me',
    run: () => [`  email   ${content.contact.email}`, ...content.contact.links.map((l) => `  link    ${l.label}`)],
  },
  theme: {
    help: 'theme light | dark | auto',
    run: ([mode]) => {
      const root = document.documentElement;
      if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
      else if (mode === 'auto') delete root.dataset.theme;
      else return 'usage: theme light | dark | auto';
      return `theme → ${mode}`;
    },
  },
  quote: {
    help: 'a line from the notebook',
    run: () => {
      const all = Object.values(content.quoteLibrary).flat();
      return `  “${all[Math.floor(Math.random() * all.length)]}”`;
    },
  },
  echo: { help: 'print text', run: (args) => args.join(' ') },
  date: { help: 'current date', run: () => new Date().toString() },
  history: { help: 'command history', run: (_, ctx) => ctx.history.map((h, i) => `  ${i + 1}  ${h}`) },
  clear: {
    help: 'clear the screen',
    run: (_, ctx) => {
      ctx.clear();
    },
  },
  sudo: { help: 'try it', run: () => 'permission denied: this portfolio runs in user mode' },
  exit: {
    help: 'close the terminal',
    run: (_, ctx) => {
      ctx.close();
    },
  },
};

export function complete(input: string): string {
  const parts = input.split(/\s+/);
  if (parts.length === 1) {
    const m = Object.keys(COMMANDS).filter((k) => k.startsWith(parts[0]));
    return m.length === 1 ? `${m[0]} ` : input;
  }
  if (parts[0] === 'cd' && parts.length === 2) {
    const m = chapterIds.filter((k) => k.startsWith(parts[1]));
    return m.length === 1 ? `cd ${m[0]}` : input;
  }
  return input;
}
