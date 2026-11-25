import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

/**
 * A full-width pause between chapters: one short line whose words light up
 * as it scrolls toward the centre of the screen.
 */
export function ChapterBreak({ line }: { line: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] });
  const p = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const words = line.split(' ');

  return (
    <motion.section ref={ref} className="cbreak" aria-label="Interlude" style={{ '--p': p } as unknown as CSSProperties}>
      <span className="cbreak__rule" aria-hidden="true">
        <i />
      </span>
      <p className="cbreak__line" style={{ '--n': words.length } as CSSProperties}>
        {words.map((w, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
      <span className="cbreak__rule" aria-hidden="true">
        <i />
      </span>
    </motion.section>
  );
}
