import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { clamp, lerp, seg } from './math';

export interface BookHandle {
  /** 0 = closed (cover on the right, centred), 1 = open at the central spread */
  setFlip(v: number): void;
  root: HTMLDivElement | null;
}

interface BookProps {
  /** Number of paper leaves turned before the spread (cover excluded) */
  leaves?: number;
  cover: ReactNode;
  insideCover?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  backCover?: ReactNode;
  /** Content for the pages that flip past, in the order they're seen (0 = first page after the cover) */
  pageArt?: (n: number) => ReactNode;
  /** Journal chapter tabs on the fore-edge; each links to a section */
  tabs?: { label: string; href: string }[];
  className?: string;
  label: string;
}

/**
 * A 3D book whose page turns are driven imperatively (no React re-render per frame).
 * The spine sits at the centre of the root; leaves hinge on their left edge.
 */
export const Book = forwardRef<BookHandle, BookProps>(function Book(
  { leaves = 4, cover, insideCover, left, right, backCover, pageArt, tabs, className = '', label },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const widthRef = useRef(0);
  const total = leaves + 1; // cover + paper leaves

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    setFlip(v: number) {
      const flip = clamp(v);
      // Smootherstep: zero velocity and acceleration at both ends, so every turn starts and lands softly.
      const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
      const coverT = smooth(seg(flip, 0, 0.36));
      // Paper leaves overlap their neighbours so the turning flows like a riffle, not stop–start.
      const start = 0.18;
      const dur = 0.34;
      const stepGap = (1 - start - dur) / Math.max(1, leaves - 1);
      // Each page lifts slightly mid-turn so it arcs over the book instead of swinging flat.
      if (!widthRef.current) widthRef.current = rootRef.current?.offsetWidth ?? 0;
      const lift = widthRef.current * 0.022;
      for (let i = 0; i < total; i++) {
        const el = leafRefs.current[i];
        if (!el) continue;
        const a = start + (i - 1) * stepGap;
        const t = i === 0 ? coverT : smooth(seg(flip, a, a + dur));
        const arc = Math.sin(t * Math.PI);
        const z = (t < 0.5 ? (total - i) * 0.6 : (i + 1) * 0.6) + arc * lift * (i === 0 ? 0.5 : 1);
        el.style.transform = `translateZ(${z.toFixed(2)}px) rotateY(${(-180 * t).toFixed(3)}deg)`;
        el.style.setProperty('--shade', (arc * 0.32).toFixed(3));
      }
      if (shiftRef.current) {
        shiftRef.current.style.transform = `translateX(${lerp(-25, 0, coverT)}%)`;
      }
      rootRef.current?.style.setProperty('--open', String(coverT));
      // Page sketches animate only while pages are actually moving.
      if (rootRef.current) rootRef.current.dataset.turning = flip > 0.001 && flip < 0.999 ? 'true' : 'false';
    },
  }));

  return (
    <div className={`book ${className}`} ref={rootRef} role="group" aria-label={label}>
      <div className="book__shift" ref={shiftRef}>
        <div className="book__board">
          <div className="book__board-front">
            <div className="book__page book__page--right">{right}</div>
          </div>
          {backCover && <div className="book__board-back">{backCover}</div>}
          {tabs && tabs.length > 0 && (
            <nav className="book__tabs" aria-label="Chapters">
              {tabs.map((t, i) => (
                <a key={t.href} className="book__tab" href={t.href} style={{ '--i': i } as React.CSSProperties}>
                  <span>{t.label}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
        <span className="book__ribbon" aria-hidden="true" />
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`book__leaf ${i === 0 ? 'book__leaf--cover' : ''}`}
            ref={(el) => {
              leafRefs.current[i] = el;
            }}
            style={{ transform: `translateZ(${(total - i) * 0.6}px)` }}
          >
            <div className="book__face book__face--front" aria-hidden={i !== 0 || undefined}>
              {i === 0 ? cover : <div className="book__blank">{pageArt?.(2 * (i - 1))}</div>}
            </div>
            <div className="book__face book__face--back">
              {i === total - 1 ? (
                <div className="book__page book__page--left">{left}</div>
              ) : i === 0 ? (
                <div className="book__inside-cover">{insideCover}</div>
              ) : (
                <div className="book__blank book__blank--left">{pageArt?.(2 * (i - 1) + 1)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
