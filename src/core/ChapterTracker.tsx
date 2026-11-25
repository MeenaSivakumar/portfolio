import { useEffect } from 'react';
import { CHAPTERS } from '../shared/chapters';
import { journeyBus } from '../shared/journeyBus';
import { clamp } from './journey/math';

/** Observes chapter anchors and publishes position to the journey bus. Renders nothing. */
export function ChapterTracker() {
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = vh * 0.4;
      const tops = CHAPTERS.map((c) => {
        const el = document.getElementById(c.anchor);
        return el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      });
      let idx = 0;
      tops.forEach((t, i) => {
        if (t <= line) idx = i;
      });
      const start = tops[idx];
      const nextTop = tops.slice(idx + 1).find((t) => Number.isFinite(t));
      const end = nextTop ?? start + document.documentElement.scrollHeight;
      const chapterProgress = clamp((line - start) / Math.max(1, end - start));
      const scrollable = document.documentElement.scrollHeight - vh;
      journeyBus.publish({
        chapter: CHAPTERS[idx].id,
        chapterIndex: idx,
        chapterProgress: Math.round(chapterProgress * 1000) / 1000,
        overall: scrollable > 0 ? Math.round(clamp(window.scrollY / scrollable) * 1000) / 1000 : 0,
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
