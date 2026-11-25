import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Fade-and-rise on first view. Honours reduced motion via <MotionConfig reducedMotion="user">. */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'header';
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export function SectionHead({
  index,
  title,
  lead,
  epigraph,
  eyebrow,
  id,
}: {
  index: string;
  title: string;
  /** One or more paragraphs */
  lead?: string | string[];
  /** A short line set beside the lead, like an epigraph at the head of a chapter */
  epigraph?: string;
  /** Replaces the default "Chapter {index}" eyebrow */
  eyebrow?: string;
  id: string;
}) {
  return (
    <header className="section-head container">
      <Reveal>
        <span className="eyebrow" data-fx-float>
          {eyebrow ?? `Chapter ${index}`}
        </span>
      </Reveal>
      <h2 id={id} className="section-title" data-fx-heading data-fx-reveal>
        {title}
      </h2>
      {(lead || epigraph) && (
        <div className="section-head__row">
          {lead && lead.length > 0 && (
            <Reveal delay={0.1}>
              {(Array.isArray(lead) ? lead : [lead]).map((t, i) => (
                <p key={i} className="section-lead">
                  {t}
                </p>
              ))}
            </Reveal>
          )}
          {epigraph && (
            <Reveal delay={0.2} className="section-epigraph">
              <blockquote>
                <p>{epigraph}</p>
              </blockquote>
            </Reveal>
          )}
        </div>
      )}
    </header>
  );
}
