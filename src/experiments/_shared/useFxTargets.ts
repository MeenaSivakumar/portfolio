import { useEffect } from 'react';

/**
 * Applies an effect to every element matching `selector` (the core's data-fx-* hooks),
 * including ones added later, and fully undoes it on unmount. The effect returns its
 * own cleanup. This is how experiments decorate the core without the core knowing.
 */
export function useFxTargets(selector: string, apply: (el: HTMLElement) => void | (() => void), deps: unknown[] = []) {
  useEffect(() => {
    const cleanups = new Map<HTMLElement, (() => void) | void>();
    const scan = () => {
      const found = new Set(Array.from(document.querySelectorAll<HTMLElement>(selector)));
      found.forEach((el) => {
        if (!cleanups.has(el)) cleanups.set(el, apply(el));
      });
      cleanups.forEach((fn, el) => {
        if (!found.has(el)) {
          fn?.();
          cleanups.delete(el);
        }
      });
    };
    scan();
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
      cleanups.forEach((fn) => fn?.());
      cleanups.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, ...deps]);
}
