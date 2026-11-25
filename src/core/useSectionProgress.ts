import { useLayoutEffect, type RefObject } from 'react';
import { clamp } from './journey/math';

/**
 * Calls onProgress(0..1) as a tall section scrolls through its pinned viewport. No re-renders.
 * Progress eases toward the scroll position (~70ms), so wheel steps glide; big jumps snap.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = 0;
    let current = 0;
    let follow = 0;
    let last = 0;
    const readTarget = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
    };
    const step = (now: number) => {
      follow = 0;
      const dt = Math.min(64, now - (last || now));
      last = now;
      const diff = target - current;
      if (Math.abs(diff) > 0.3) current = target;
      else current += diff * (1 - Math.exp(-dt / 70));
      if (Math.abs(target - current) < 0.0002) current = target;
      onProgress(current);
      if (current !== target) follow = requestAnimationFrame(step);
      else last = 0;
    };
    const schedule = () => {
      readTarget();
      if (!follow) {
        last = performance.now();
        follow = requestAnimationFrame(step);
      }
    };
    readTarget();
    current = target;
    onProgress(current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(follow);
    };
  }, [ref, onProgress]);
}
