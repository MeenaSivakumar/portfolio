import { useState, type CSSProperties, type MouseEvent, type ReactElement } from 'react';

/**
 * DEMO components for the playground. They are generic UI demos, not portfolio
 * content — replace or extend them with your own components.
 */

export type Control =
  | { key: string; label: string; type: 'range'; min: number; max: number; step?: number }
  | { key: string; label: string; type: 'toggle' }
  | { key: string; label: string; type: 'select'; options: string[] }
  | { key: string; label: string; type: 'text' };

export type Props = Record<string, string | number | boolean>;

export interface Demo {
  id: string;
  name: string;
  controls: Control[];
  defaults: Props;
  render(p: Props): ReactElement;
  code(p: Props): string;
}

function Toggle({ size, round, label }: Props) {
  const [on, setOn] = useState(true);
  const s = Number(size);
  return (
    <label className="pg-toggle" style={{ '--s': `${s}px`, '--r': round ? '999px' : '6px' } as CSSProperties}>
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <span className="pg-toggle__track">
        <span className="pg-toggle__thumb" />
      </span>
      <span>{String(label)}</span>
    </label>
  );
}

function Ripple({ label, radius, variant }: Props) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((rs) => [...rs, { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
    window.setTimeout(() => setRipples((rs) => rs.filter((q) => q.id !== id)), 700);
  };
  return (
    <button type="button" className={`pg-ripple pg-ripple--${variant}`} style={{ borderRadius: Number(radius) }} onClick={onClick}>
      {String(label)}
      {ripples.map((r) => (
        <i key={r.id} style={{ left: r.x, top: r.y }} />
      ))}
    </button>
  );
}

function Accordion({ count, single }: Props) {
  const [open, setOpen] = useState<number[]>([0]);
  return (
    <div className="pg-acc">
      {Array.from({ length: Number(count) }, (_, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i} className="pg-acc__item" data-open={isOpen}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() =>
                setOpen((o) => (isOpen ? o.filter((x) => x !== i) : single ? [i] : [...o, i]))
              }
            >
              [Question {i + 1}] <span aria-hidden="true">+</span>
            </button>
            <div className="pg-acc__panel">
              <div>
                <p>[Answer placeholder {i + 1}]</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Ring({ value, thickness, showLabel }: Props) {
  const R = 54;
  const C = 2 * Math.PI * R;
  return (
    <div className="pg-ring">
      <svg viewBox="0 0 140 140" width="160" height="160">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth={Number(thickness)} />
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke="var(--fg)"
          strokeWidth={Number(thickness)}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Number(value) / 100)}
          style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.22,1,.36,1)' }}
          transform="rotate(-90 70 70)"
        />
      </svg>
      {showLabel && <span>{Number(value)}%</span>}
    </div>
  );
}

export const DEMOS: Demo[] = [
  {
    id: 'toggle',
    name: 'Toggle switch',
    controls: [
      { key: 'size', label: 'Size', type: 'range', min: 20, max: 48 },
      { key: 'round', label: 'Rounded', type: 'toggle' },
      { key: 'label', label: 'Label', type: 'text' },
    ],
    defaults: { size: 28, round: true, label: '[Setting label]' },
    render: (p) => <Toggle {...p} />,
    code: (p) => `<Toggle size={${p.size}} rounded={${p.round}} label="${p.label}" />`,
  },
  {
    id: 'ripple',
    name: 'Ripple button',
    controls: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'radius', label: 'Radius', type: 'range', min: 0, max: 32 },
      { key: 'variant', label: 'Style', type: 'select', options: ['solid', 'outline'] },
    ],
    defaults: { label: '[Click me]', radius: 999, variant: 'solid' },
    render: (p) => <Ripple {...p} />,
    code: (p) => `<RippleButton variant="${p.variant}" radius={${p.radius}}>${p.label}</RippleButton>`,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    controls: [
      { key: 'count', label: 'Items', type: 'range', min: 2, max: 6 },
      { key: 'single', label: 'One open at a time', type: 'toggle' },
    ],
    defaults: { count: 3, single: true },
    render: (p) => <Accordion {...p} />,
    code: (p) => `<Accordion items={items.slice(0, ${p.count})} single={${p.single}} />`,
  },
  {
    id: 'ring',
    name: 'Progress ring',
    controls: [
      { key: 'value', label: 'Value', type: 'range', min: 0, max: 100 },
      { key: 'thickness', label: 'Thickness', type: 'range', min: 2, max: 20 },
      { key: 'showLabel', label: 'Show label', type: 'toggle' },
    ],
    defaults: { value: 64, thickness: 10, showLabel: true },
    render: (p) => <Ring {...p} />,
    code: (p) => `<ProgressRing value={${p.value}} thickness={${p.thickness}} label={${p.showLabel}} />`,
  },
];
