import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { content } from '../../content/content';
import { Reveal, SectionHead } from '../Reveal';

const pad = (n: number) => String(n).padStart(2, '0');

export function Achievements() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const fillPct = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section id="achievements" data-chapter="achievements" className="achievements" aria-labelledby="achievements-title">
      <SectionHead
        index="05"
        title={content.achievementsTitle}
        id="achievements-title"
        lead={content.achievementsLead}
        epigraph={content.achievementsEpigraph}
      />

      <div className="container">
        <Reveal className="stats">
          {content.stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__value" data-fx-float>
                {s.value}
              </span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </Reveal>

        <ol className="timeline" ref={listRef}>
          <span className="timeline__rail" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ height: fillPct }} />
          </span>
          {content.achievements.map((a, i) => (
            <motion.li
              key={i}
              className={`milestone milestone--${i % 2 ? 'right' : 'left'}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -18% 0px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="milestone__node" aria-hidden="true">
                <i />
              </span>
              <div className="milestone__card" data-fx-card>
                <div className="milestone__top">
                  <span className="milestone__index">{pad(i + 1)}</span>
                  <span className="eyebrow">{a.label}</span>
                </div>
                <h3>{a.title}</h3>
                {a.body.map((t, j) => (
                  <p key={j}>{t}</p>
                ))}
                <span className="milestone__cat">
                  {a.category}
                  {a.date ? ` · ${a.date}` : ''}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
