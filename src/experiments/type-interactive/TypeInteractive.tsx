import { finePointer, reducedMotion } from '../_shared/env';
import { splitText } from '../_shared/splitText';
import { useFxTargets } from '../_shared/useFxTargets';
import type { VariantProps } from '../types';
import '../_shared/split.css';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

export default function TypeInteractive({ variant }: VariantProps) {
  useFxTargets(
    '[data-fx-heading]',
    (el) => {
      if (!finePointer() || reducedMotion()) return;
      if (variant === 'scramble') {
        const original = el.textContent ?? '';
        let raf = 0;
        let running = false;
        const run = () => {
          if (running) return;
          running = true;
          const start = performance.now();
          const saved = Array.from(el.childNodes);
          const hadLabel = el.hasAttribute('aria-label');
          if (!hadLabel) el.setAttribute('aria-label', original);
          const span = document.createElement('span');
          span.setAttribute('aria-hidden', 'true');
          el.replaceChildren(span);
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / 700);
            const reveal = Math.floor(p * original.length);
            span.textContent = original
              .split('')
              .map((ch, i) => (i < reveal || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join('');
            if (p < 1) raf = requestAnimationFrame(tick);
            else {
              el.replaceChildren(...saved);
              if (!hadLabel) el.removeAttribute('aria-label');
              running = false;
            }
          };
          raf = requestAnimationFrame(tick);
          cleanupRun = () => {
            cancelAnimationFrame(raf);
            el.replaceChildren(...saved);
            if (!hadLabel) el.removeAttribute('aria-label');
          };
        };
        let cleanupRun: (() => void) | null = null;
        el.addEventListener('pointerenter', run);
        return () => {
          el.removeEventListener('pointerenter', run);
          if (running) cleanupRun?.();
        };
      }

      const split = splitText(el, 'type-interactive', 'chars');
      if (!split) return;
      el.classList.add(`fx-type-${variant}`);
      const move = (e: PointerEvent) => {
        split.units.forEach((u) => {
          const r = u.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const k = Math.max(0, 1 - d / 160);
          if (variant === 'letter-lift') u.style.transform = `translateY(${-k * 0.18}em)`;
          else {
            u.style.transform = `scale(${1 + k * 0.25})`;
            u.style.opacity = String(0.45 + k * 0.55);
          }
        });
      };
      const leave = () =>
        split.units.forEach((u) => {
          u.style.transform = '';
          u.style.opacity = '';
        });
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        el.classList.remove(`fx-type-${variant}`);
        split.restore();
      };
    },
    [variant],
  );
  return (
    <style>{`
      .fx-type-letter-lift .fx-char, .fx-type-proximity .fx-char {
        transition: transform .35s cubic-bezier(.22,1,.36,1), opacity .35s;
        transform-origin: 50% 80%;
      }
    `}</style>
  );
}
