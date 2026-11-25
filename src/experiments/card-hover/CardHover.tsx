import { finePointer, reducedMotion } from '../_shared/env';
import { useFxTargets } from '../_shared/useFxTargets';
import type { VariantProps } from '../types';
import './card-hover.css';

export default function CardHover({ variant }: VariantProps) {
  useFxTargets(
    '[data-fx-card]',
    (el) => {
      if (!finePointer()) return;
      const cls = `fx-card-${variant}`;
      el.classList.add(cls);
      const prevPos = el.style.position;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      const prevTransform = el.style.transform;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--fx-x', `${px * 100}%`);
        el.style.setProperty('--fx-y', `${py * 100}%`);
        if (variant === 'tilt' && !reducedMotion()) {
          el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg)`;
        }
      };
      const leave = () => {
        if (variant === 'tilt') el.style.transform = prevTransform;
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.classList.remove(cls);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        el.style.position = prevPos;
        el.style.transform = prevTransform;
        el.style.removeProperty('--fx-x');
        el.style.removeProperty('--fx-y');
      };
    },
    [variant],
  );
  return null;
}
