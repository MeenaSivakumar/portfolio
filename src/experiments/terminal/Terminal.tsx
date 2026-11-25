import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { WIDE_QUERY } from '../../shared/breakpoints';
import type { VariantProps } from '../types';
import { COMMANDS, complete, type Ctx, type Line } from './commands';
import './terminal.css';

const WELCOME: Line[] = [
  { kind: 'sys', text: 'journey-shell v0.1 — type `help` to begin, `ls` to see chapters.' },
];

function Shell({ onClose, autoFocus }: { onClose?: () => void; autoFocus?: boolean }) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const next: Line[] = [{ kind: 'in', text: input }];
      let cleared = false;
      if (input) {
        const [name, ...args] = input.split(/\s+/);
        const cmd = COMMANDS[name.toLowerCase()];
        const ctx: Ctx = {
          history: [...history, input],
          clear: () => {
            cleared = true;
          },
          close: () => onClose?.(),
        };
        if (!cmd) next.push({ kind: 'err', text: `command not found: ${name}` });
        else {
          const out = cmd.run(args, ctx);
          if (out != null) (Array.isArray(out) ? out : [out]).forEach((t) => next.push({ kind: 'out', text: t }));
        }
        setHistory((h) => [...h, input]);
      }
      setLines((l) => (cleared ? [] : [...l, ...next]));
      setValue('');
      setCursor(null);
    },
    [history, onClose],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') run(value);
    else if (e.key === 'Tab') {
      e.preventDefault();
      setValue((v) => complete(v));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const i = cursor == null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor == null) return;
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(null);
        setValue('');
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    } else if (e.key === 'Escape') onClose?.();
    else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="term" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">~/journey</span>
        {onClose && (
          <button type="button" className="term__close" onClick={onClose} aria-label="Close terminal">
            ×
          </button>
        )}
      </div>
      <div className="term__body" ref={bodyRef} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`term__line term__line--${l.kind}`}>
            {l.kind === 'in' && <span className="term__prompt">❯ </span>}
            {l.text}
          </div>
        ))}
        <label className="term__input">
          <span className="term__prompt" aria-hidden="true">
            ❯
          </span>
          <span className="visually-hidden">Terminal command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />
        </label>
      </div>
    </div>
  );
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => !window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const on = () => setNarrow(!mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

function Dock() {
  const [open, setOpen] = useState(false);
  const narrow = useNarrow();
  // On small screens a floating corner button would cover page text, so the
  // launcher moves into the header's experiment area when the page offers one.
  const headerSlot = narrow ? document.querySelector<HTMLElement>('[data-fx-header-slot]') : null;
  const inHeader = !!headerSlot;
  const launcher = (
    <button
      type="button"
      className={`term-launch ${inHeader ? 'term-launch--header' : ''}`}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-label={open ? 'Close terminal' : 'Open terminal'}
      data-fx-magnetic={inHeader ? undefined : true}
    >
      <span aria-hidden="true">{'>_'}</span>
    </button>
  );
  const offset = inHeader ? -24 : 24;
  return (
    <>
      {headerSlot ? createPortal(launcher, headerSlot) : launcher}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`term-window ${inHeader ? 'term-window--top' : ''}`}
            role="dialog"
            aria-label="Terminal"
            initial={{ opacity: 0, y: offset, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: offset, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <Shell autoFocus onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dropdown() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest('input, textarea, [contenteditable]') && !t.closest('.term-drop');
      if (e.key === '`' && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <button type="button" className="term-tab" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        console <kbd>`</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="term-drop"
            role="dialog"
            aria-label="Terminal"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 34 }}
          >
            <Shell autoFocus onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section() {
  return (
    <section className="term-section" aria-label="Interactive terminal">
      <div className="term-section__inner">
        <div className="term-section__copy">
          <span className="eyebrow">Interlude · Console</span>
          <h2>Explore from the command line</h2>
          <p>Try `help`, `ls`, `projects` or `cd articles`.</p>
        </div>
        <Shell />
      </div>
    </section>
  );
}

export default function Terminal({ variant }: VariantProps) {
  if (variant === 'dropdown') return <Dropdown />;
  if (variant === 'section') return <Section />;
  return <Dock />;
}
