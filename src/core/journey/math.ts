export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Normalised position of v inside [a, b], clamped to 0..1 */
export const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;

/** Position within a run of n "steps", holding on each step and easing between them near the end. */
export function stepPos(local: number, n: number, transitionStart = 0.72) {
  if (local <= 0) return 0;
  const i = Math.floor(local);
  const f = local - i;
  return clamp(i + easeInOut(seg(f, transitionStart, 1)), 0, n - 1);
}
