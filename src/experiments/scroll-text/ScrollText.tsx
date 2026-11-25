import { reducedMotion } from '../_shared/env';
import { splitText } from '../_shared/splitText';
import { useFxTargets } from '../_shared/useFxTargets';
import type { VariantProps } from '../types';
import '../_shared/split.css';
import './scroll-text.css';

export default function ScrollText({ variant }: VariantProps) {
  useFxTargets(
    '[data-fx-reveal]',
    (el) => {
      if (reducedMotion()) return;
      if (variant === 'blur-in') {
        el.classList.add('fx-blur-in');
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.classList.add('is-in');
              io.disconnect();
            }
          },
          { rootMargin: '0px 0px -15% 0px' },
        );
        io.observe(el);
        return () => {
          io.disconnect();
          el.classList.remove('fx-blur-in', 'is-in');
        };
      }

      const split = splitText(el, 'scroll-text', 'words');
      if (!split) return;

      if (variant === 'scrub') {
        el.classList.add('fx-scrub');
        let raf = 0;
        const update = () => {
          raf = 0;
          const r = el.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.5)));
          const n = split.units.length;
          split.units.forEach((u, i) => {
            u.style.opacity = String(0.15 + 0.85 * Math.min(1, Math.max(0, p * n - i)));
          });
        };
        const onScroll = () => {
          if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          window.removeEventListener('scroll', onScroll);
          cancelAnimationFrame(raf);
          el.classList.remove('fx-scrub');
          split.restore();
        };
      }

      el.classList.add('fx-word-rise');
      split.units.forEach((u, i) => u.style.setProperty('--i', String(i)));
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        el.classList.remove('fx-word-rise', 'is-in');
        split.restore();
      };
    },
    [variant],
  );
  return null;
}
