import { reducedMotion } from '../_shared/env';
import { useFxTargets } from '../_shared/useFxTargets';
import type { VariantProps } from '../types';

export default function SubtleMotion({ variant }: VariantProps) {
  useFxTargets(
    '[data-fx-float]',
    (el) => {
      if (reducedMotion()) return;
      const prev = el.style.transform;
      const prevDisplay = el.style.display;
      if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
      let raf = 0;
      if (variant === 'breathe') {
        const seed = Math.random() * 6;
        const tick = (t: number) => {
          el.style.transform = `translate3d(0, ${Math.sin(t / 900 + seed) * 4}px, 0)`;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
          cancelAnimationFrame(raf);
          el.style.transform = prev;
          el.style.display = prevDisplay;
        };
      }
      const handler =
        variant === 'pointer'
          ? (e: Event) => {
              const pe = e as PointerEvent;
              const r = el.getBoundingClientRect();
              const dx = pe.clientX - (r.left + r.width / 2);
              const dy = pe.clientY - (r.top + r.height / 2);
              const k = Math.max(0, 1 - Math.hypot(dx, dy) / 400);
              el.style.transform = `translate3d(${-dx * 0.04 * k}px, ${-dy * 0.04 * k}px, 0)`;
            }
          : () => {
              if (raf) return;
              raf = requestAnimationFrame(() => {
                raf = 0;
                const r = el.getBoundingClientRect();
                const off = (r.top + r.height / 2 - innerHeight / 2) * -0.08;
                el.style.transform = `translate3d(0, ${off}px, 0)`;
              });
            };
      const evt = variant === 'pointer' ? 'pointermove' : 'scroll';
      window.addEventListener(evt, handler, { passive: true });
      if (variant !== 'pointer') handler(new Event('scroll'));
      return () => {
        window.removeEventListener(evt, handler);
        cancelAnimationFrame(raf);
        el.style.transform = prev;
        el.style.display = prevDisplay;
      };
    },
    [variant],
  );
  return null;
}
