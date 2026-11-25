import { finePointer, reducedMotion } from '../_shared/env';
import { useFxTargets } from '../_shared/useFxTargets';
import type { VariantProps } from '../types';

export default function Magnetic({ variant }: VariantProps) {
  const strength = variant === 'strong' ? 0.45 : 0.22;
  useFxTargets(
    '[data-fx-magnetic]',
    (el) => {
      if (!finePointer() || reducedMotion()) return;
      const prevTransition = el.style.transition;
      const prevTransform = el.style.transform;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = 'transform .2s cubic-bezier(.22,1,.36,1)';
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        if (variant === 'strong') el.style.setProperty('--fx-mag-x', `${dx * 0.15}px`);
      };
      const leave = () => {
        el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)';
        el.style.transform = prevTransform;
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        el.style.transition = prevTransition;
        el.style.transform = prevTransform;
      };
    },
    [variant],
  );
  return null;
}
