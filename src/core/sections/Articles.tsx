import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { content, type Article } from '../../content/content';
import { Reveal, SectionHead } from '../Reveal';

const pad = (n: number) => String(n).padStart(2, '0');
const minutes = (a: Article) => parseInt(a.readTime, 10) || 0;
const TOPICS = ['All', 'React', 'Career', 'Stupro'] as const;
type Topic = (typeof TOPICS)[number];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Touch screens have no hover, so the one article nearest the middle of the screen plays the hover
 * animation instead (row slides out, arrow nudges, cover lifts). Sets data-active, no re-render.
 */
function useReadingLine(rootRef: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(hover: hover)').matches) return;
    let frame = 0;
    let active: Element | null = null;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best: Element | null = null;
      let bestDist = Infinity;
      for (const el of root.querySelectorAll('[data-reading]')) {
        const r = el.getBoundingClientRect();
        if (r.bottom < mid - window.innerHeight * 0.3 || r.top > mid + window.innerHeight * 0.3) continue;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }
      if (best === active) return;
      active?.removeAttribute('data-active');
      best?.setAttribute('data-active', '');
      active = best;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      active?.removeAttribute('data-active');
    };
  }, [rootRef, key]);
}

function LeadStory({ article, n }: { article: Article; n: number }) {
  return (
    <motion.article
      layout
      className="alead"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease }}
    >
      <a href={article.href} target="_blank" rel="noreferrer" className="alead__link" data-fx-card data-reading>
        {article.image ? (
          <img className="alead__cover" src={article.image} alt="" />
        ) : (
          <div className="alead__cover acover" aria-hidden="true">
            <span className="acover__top">
              <span>No. {pad(n)}</span>
              <span>{article.topic}</span>
            </span>
            <span className="acover__title">{article.title}</span>
            <span className="acover__top">
              <span>{article.publisher}</span>
              <span>{article.readTime}</span>
            </span>
          </div>
        )}
        <div className="alead__body">
          <div className="alead__meta">
            <span className="atopic">{article.topic}</span>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
          <h3 className={article.image ? 'alead__title' : 'visually-hidden'}>{article.title}</h3>
          <p className="alead__excerpt">{article.excerpt}</p>
          <span className="alead__cta">Read on {article.publisher} ↗</span>
        </div>
      </a>
    </motion.article>
  );
}

export function Articles() {
  const [topic, setTopic] = useState<Topic>('All');
  const gridRef = useRef<HTMLDivElement>(null);
  useReadingLine(gridRef, topic);
  const all = content.articles;
  const totalMin = all.reduce((t, a) => t + minutes(a), 0);
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: all.length };
    all.forEach((a) => (c[a.topic] = (c[a.topic] ?? 0) + 1));
    return c;
  }, [all]);

  const list = topic === 'All' ? all : all.filter((a) => a.topic === topic);
  const [lead, ...rest] = list;
  const numberOf = (a: Article) => all.indexOf(a) + 1;

  return (
    <section id="articles" data-chapter="articles" className="articles" aria-labelledby="articles-title">
      <SectionHead index="06" title="Articles" id="articles-title" lead={content.articlesLead} epigraph={content.articlesEpigraph} />

      <div className="container">
        <Reveal className="abar">
          <p className="abar__stats">
            <strong>{all.length}</strong> essays <i>·</i> <strong>{totalMin}</strong> min of reading <i>·</i> on Medium
          </p>
          <div className="abar__filters" role="group" aria-label="Filter articles by topic">
            {TOPICS.map((t) => (
              <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className="achip">
                {topic === t && <motion.span layoutId="achip-bg" className="achip__bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="achip__label">
                  {t} <em>{counts[t] ?? 0}</em>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <LayoutGroup>
          <div className="articles__grid" ref={gridRef}>
            <AnimatePresence mode="popLayout">{lead && <LeadStory key={lead.href} article={lead} n={numberOf(lead)} />}</AnimatePresence>

            <motion.ol layout className="alist" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                {rest.map((a, i) => (
                  <motion.li
                    layout
                    key={a.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.04, ease } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <a href={a.href} target="_blank" rel="noreferrer" className="arow" data-reading>
                      <span className="arow__n">{pad(numberOf(a))}</span>
                      <span className="arow__main">
                        <span className="arow__meta">
                          <span className="atopic">{a.topic}</span>
                          {a.date} · {a.readTime}
                        </span>
                        <span className="arow__title">{a.title}</span>
                        <span className="arow__excerpt">{a.excerpt}</span>
                      </span>
                      <span className="arow__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
              {rest.length === 0 && <li className="alist__empty">That’s the only essay on this topic so far.</li>}
            </motion.ol>
          </div>
        </LayoutGroup>

        <Reveal className="afoot">
          <a className="btn" href={content.articlesUrl} target="_blank" rel="noreferrer" data-fx-magnetic>
            Follow on Medium ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
