import { AnimatePresence, LayoutGroup, motion, useAnimationFrame } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { reducedMotion } from '../_shared/env';
import type { VariantProps } from '../types';
import { CENTER_LABEL, groupIndex, groups, items, links, neighbours, type TechItem } from './data';
import './tech-universe.css';

const shade = (gid: string) => `var(--exp-${groupIndex(gid) + 1})`;

function Legend({ focus, setFocus }: { focus: string | null; setFocus: (g: string | null) => void }) {
  return (
    <ul className="tu-legend">
      {groups.map((g) => (
        <li key={g.id}>
          <button
            type="button"
            aria-pressed={focus === g.id}
            onClick={() => setFocus(focus === g.id ? null : g.id)}
            onMouseEnter={() => setFocus(g.id)}
            onMouseLeave={() => setFocus(null)}
          >
            <i style={{ background: shade(g.id) }} />
            {g.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Detail({ item }: { item: TechItem | null }) {
  return (
    <div className="tu-detail" aria-live="polite">
      {item ? (
        <>
          <span className="eyebrow">{groups[groupIndex(item.group)].label}</span>
          <strong>{item.label}</strong>
          <span className="tu-detail__links">
            Connected to:{' '}
            {[...neighbours(item.id)].map((n) => items.find((i) => i.id === n)?.label).join(', ') || '—'}
          </span>
        </>
      ) : (
        <span className="tu-detail__hint">Hover or focus a node to trace its connections.</span>
      )}
    </div>
  );
}

/* ── Orbits ─────────────────────────────────────────────── */
function Orbits() {
  const [t, setT] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const paused = useRef(false);
  const still = reducedMotion();
  useAnimationFrame((_, delta) => {
    if (!paused.current && !still) setT((v) => v + delta / 1000);
  });

  const radii = [130, 205, 280, 355];
  const pos = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    groups.forEach((g, gi) => {
      const its = items.filter((i) => i.group === g.id);
      const speed = (gi % 2 ? -1 : 1) * (0.06 + gi * 0.015);
      its.forEach((it, k) => {
        const a = (k / its.length) * Math.PI * 2 + gi * 0.7 + t * speed;
        map.set(it.id, { x: 400 + Math.cos(a) * radii[gi], y: 400 + Math.sin(a) * radii[gi] });
      });
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const near = hover ? neighbours(hover) : null;
  const active = (it: TechItem) => (!hover && !focus) || it.id === hover || near?.has(it.id) || it.group === focus;

  return (
    <div className="tu-orbit">
      <svg viewBox="0 0 800 800" role="img" aria-label="Technology orbits" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
        {radii.map((r, gi) => (
          <circle key={r} cx="400" cy="400" r={r} className="tu-ring" data-dim={focus != null && groups[gi].id !== focus} />
        ))}
        {links.map(([a, b]) => {
          const on = hover && (a === hover || b === hover);
          if (!on) return null;
          const pa = pos.get(a)!;
          const pb = pos.get(b)!;
          return <path key={a + b} d={`M${pa.x},${pa.y} Q400,400 ${pb.x},${pb.y}`} className="tu-link" />;
        })}
        <g className="tu-core">
          <circle cx="400" cy="400" r="54" />
          <text x="400" y="405" textAnchor="middle">
            {CENTER_LABEL}
          </text>
        </g>
        {items.map((it) => {
          const p = pos.get(it.id)!;
          return (
            <g
              key={it.id}
              className="tu-node"
              data-dim={!active(it)}
              transform={`translate(${p.x} ${p.y})`}
              tabIndex={0}
              onMouseEnter={() => setHover(it.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => {
                paused.current = true;
                setHover(it.id);
              }}
              onBlur={() => {
                paused.current = false;
                setHover(null);
              }}
            >
              <circle r={hover === it.id ? 13 : 9} style={{ fill: shade(it.group) }} />
              <text y="-18" textAnchor="middle">
                {it.label}
              </text>
            </g>
          );
        })}
      </svg>
      <aside>
        <Legend focus={focus} setFocus={setFocus} />
        <Detail item={items.find((i) => i.id === hover) ?? null} />
      </aside>
    </div>
  );
}

/* ── Force graph ────────────────────────────────────────── */
interface SimNode {
  id: string;
  label: string;
  group: string;
  hub: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function Graph() {
  const W = 900;
  const H = 560;
  const nodes = useRef<SimNode[]>([]);
  if (!nodes.current.length) {
    nodes.current = [
      ...groups.map((g, i) => ({ id: g.id, label: g.label, group: g.id, hub: true, x: W / 2 + Math.cos(i * 1.57) * 160, y: H / 2 + Math.sin(i * 1.57) * 120, vx: 0, vy: 0 })),
      ...items.map((it, i) => ({ ...it, hub: false, x: W / 2 + Math.cos(i) * 220, y: H / 2 + Math.sin(i) * 180, vx: 0, vy: 0 })),
    ];
  }
  const edges = useMemo(() => [...items.map((it) => [it.id, it.group] as [string, string]), ...links], []);
  const [, force] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ id: string; svg: SVGSVGElement } | null>(null);
  const energy = useRef(1);

  useAnimationFrame(() => {
    if (energy.current < 0.02 && !drag.current) return;
    const ns = nodes.current;
    const byId = new Map(ns.map((n) => [n.id, n]));
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i];
        const b = ns[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const d2 = Math.max(dx * dx + dy * dy, 80);
        const f = 1400 / d2;
        const d = Math.sqrt(d2);
        dx /= d;
        dy /= d;
        a.vx += dx * f;
        a.vy += dy * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
      }
    }
    edges.forEach(([s, t]) => {
      const a = byId.get(s)!;
      const b = byId.get(t)!;
      const rest = a.hub || b.hub ? 70 : 140;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - rest) * 0.012;
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
    });
    let e = 0;
    ns.forEach((n) => {
      n.vx += (W / 2 - n.x) * 0.002;
      n.vy += (H / 2 - n.y) * 0.002;
      if (drag.current?.id === n.id) {
        n.vx = 0;
        n.vy = 0;
        return;
      }
      n.vx *= 0.82;
      n.vy *= 0.82;
      n.x = Math.max(30, Math.min(W - 30, n.x + n.vx));
      n.y = Math.max(30, Math.min(H - 30, n.y + n.vy));
      e += Math.abs(n.vx) + Math.abs(n.vy);
    });
    energy.current = e / ns.length;
    force((v) => v + 1);
  });

  const toSvg = (svg: SVGSVGElement, cx: number, cy: number) => {
    const r = svg.getBoundingClientRect();
    return { x: ((cx - r.left) / r.width) * W, y: ((cy - r.top) / r.height) * H };
  };

  const near = hover ? neighbours(hover) : null;
  const byId = new Map(nodes.current.map((n) => [n.id, n]));
  const lit = (id: string) => !hover || id === hover || near?.has(id) || byId.get(hover)?.group === id || byId.get(id)?.group === hover;

  return (
    <div className="tu-graph">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Technology relationship graph"
        onPointerMove={(e) => {
          if (!drag.current) return;
          const n = byId.get(drag.current.id)!;
          const p = toSvg(drag.current.svg, e.clientX, e.clientY);
          n.x = p.x;
          n.y = p.y;
          energy.current = 1;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        {edges.map(([s, t]) => {
          const a = byId.get(s)!;
          const b = byId.get(t)!;
          const on = hover && (s === hover || t === hover);
          return <line key={s + t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="tu-edge" data-on={!!on} data-dim={!!hover && !on} />;
        })}
        {nodes.current.map((n) => (
          <g
            key={n.id}
            className={`tu-gnode ${n.hub ? 'is-hub' : ''}`}
            data-dim={!lit(n.id)}
            transform={`translate(${n.x} ${n.y})`}
            tabIndex={0}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              drag.current = { id: n.id, svg: (e.currentTarget.ownerSVGElement as SVGSVGElement) };
            }}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
          >
            <circle r={n.hub ? 26 : 10} style={{ fill: n.hub ? 'var(--bg-elev)' : shade(n.group), stroke: shade(n.group) }} />
            <text y={n.hub ? 4 : -16} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="tu-caption">Drag nodes to rearrange · hover to trace relationships</p>
    </div>
  );
}

/* ── Clusters ───────────────────────────────────────────── */
function Clusters() {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const near = hover ? neighbours(hover) : null;
  return (
    <LayoutGroup>
      <div className="tu-clusters" data-open={open != null}>
        {groups.map((g) => {
          const its = items.filter((i) => i.group === g.id);
          const isOpen = open === g.id;
          return (
            <motion.div layout key={g.id} className="tu-cluster" data-open={isOpen} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              <motion.button layout="position" type="button" className="tu-cluster__head" onClick={() => setOpen(isOpen ? null : g.id)} aria-expanded={isOpen}>
                <span className="tu-cluster__bubble" style={{ background: shade(g.id), width: 40 + its.length * 10, height: 40 + its.length * 10 }} />
                <span>
                  <strong>{g.label}</strong>
                  <small>{its.length} items</small>
                </span>
              </motion.button>
              <AnimatePresence>
                {isOpen && (
                  <motion.ul className="tu-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {its.map((it, k) => (
                      <motion.li key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: k * 0.04 } }}>
                        <button type="button" onMouseEnter={() => setHover(it.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(it.id)} onBlur={() => setHover(null)}>
                          {it.label}
                          <span>{neighbours(it.id).size} links</span>
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {!isOpen && near && its.some((i) => near.has(i.id)) && <span className="tu-cluster__ping">linked</span>}
            </motion.div>
          );
        })}
      </div>
      <Detail item={items.find((i) => i.id === hover) ?? null} />
    </LayoutGroup>
  );
}

export default function TechUniverse({ variant }: VariantProps) {
  return (
    <section className="tu" aria-labelledby="tu-title">
      <header className="tu-head">
        <span className="eyebrow">Interlude · Technology universe</span>
        <h2 id="tu-title">The stack, connected</h2>
        <p>Tools from my résumé, linked where I used them together on a project.</p>
      </header>
      {variant === 'graph' ? <Graph /> : variant === 'clusters' ? <Clusters /> : <Orbits />}
    </section>
  );
}
