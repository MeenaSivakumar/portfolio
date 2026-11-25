import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { VariantProps } from '../types';
import { DEMOS, type Control, type Props } from './demos';
import './playground.css';

function Knob({ c, value, onChange }: { c: Control; value: Props[string]; onChange: (v: Props[string]) => void }) {
  const id = `pg-${c.key}`;
  return (
    <label className="pg-knob" htmlFor={id}>
      <span>
        {c.label}
        {c.type === 'range' && <em>{String(value)}</em>}
      </span>
      {c.type === 'range' && (
        <input id={id} type="range" min={c.min} max={c.max} step={c.step ?? 1} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} />
      )}
      {c.type === 'toggle' && <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />}
      {c.type === 'text' && <input id={id} type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} />}
      {c.type === 'select' && (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {c.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </label>
  );
}

function Workbench() {
  const [demoId, setDemoId] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === demoId)!;
  const [props, setProps] = useState<Props>(demo.defaults);
  const [copied, setCopied] = useState(false);
  useEffect(() => setProps(demo.defaults), [demo]);
  const code = demo.code(props);

  return (
    <div className="pg-bench">
      <nav className="pg-list" aria-label="Demo components">
        {DEMOS.map((d) => (
          <button key={d.id} type="button" aria-pressed={d.id === demoId} onClick={() => setDemoId(d.id)}>
            {d.name}
          </button>
        ))}
      </nav>
      <div className="pg-stage">
        <AnimatePresence mode="wait">
          <motion.div key={demoId} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
            {demo.render(props)}
          </motion.div>
        </AnimatePresence>
        <span className="pg-stage__tag">Demo component — replace with your own</span>
      </div>
      <div className="pg-side">
        <fieldset className="pg-knobs">
          <legend>Props</legend>
          {demo.controls.map((c) => (
            <Knob key={c.key} c={c} value={props[c.key]} onChange={(v) => setProps((p) => ({ ...p, [c.key]: v }))} />
          ))}
        </fieldset>
        <div className="pg-code">
          <pre>
            <code>{code}</code>
          </pre>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(code).then(
                () => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1200);
                },
                () => undefined,
              );
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CSS = `.card {
  padding: 28px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--bg-elev);
  transition: transform .4s cubic-bezier(.22,1,.36,1);
}
.card:hover {
  transform: translateY(-6px) rotate(-1deg);
}
.card h4 { margin: 0 0 6px; font-size: 22px; }
.card p { margin: 0; color: var(--fg-muted); }`;

function CssLab() {
  const [css, setCss] = useState(DEFAULT_CSS);
  return (
    <div className="pg-csslab">
      <div className="pg-csslab__editor">
        <label htmlFor="pg-css" className="eyebrow">
          styles.css — scoped to the preview
        </label>
        <textarea id="pg-css" value={css} onChange={(e) => setCss(e.target.value)} spellCheck={false} />
        <button type="button" className="btn" onClick={() => setCss(DEFAULT_CSS)}>
          Reset
        </button>
      </div>
      <div className="pg-stage pg-scope">
        {/* Native CSS nesting keeps edits inside .pg-scope */}
        <style>{`.pg-scope { ${css} }`}</style>
        <div className="card">
          <h4>[Card title]</h4>
          <p>[Edit the CSS on the left — this preview updates live.]</p>
        </div>
      </div>
    </div>
  );
}

function Drawer() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <button type="button" className="pg-launch" onClick={() => setOpen(true)} aria-expanded={open}>
        Playground
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="pg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="pg-drawer"
              role="dialog"
              aria-label="Component playground"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            >
              <div className="pg-drawer__head">
                <strong>Playground</strong>
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              <Workbench />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Playground({ variant }: VariantProps) {
  if (variant === 'drawer') return <Drawer />;
  return (
    <section className="pg" aria-labelledby="pg-title">
      <header className="pg-head">
        <span className="eyebrow">Interlude · Playground</span>
        <h2 id="pg-title">[Playground heading]</h2>
        <p>[Placeholder lead — try the components live.]</p>
      </header>
      {variant === 'css-lab' ? <CssLab /> : <Workbench />}
    </section>
  );
}
