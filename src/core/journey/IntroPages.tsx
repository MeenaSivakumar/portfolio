import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';
import { content } from '../../content/content';

/**
 * The opening spread, shared by the animated journey and the reduced-motion version.
 * `--i` staggers each block's entrance against the book's --content-alpha.
 */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

const HOLD_MS = 7000;

/**
 * The first page's epigraph: opens on the first line, then slowly turns through the rest,
 * like re-reading the opening of a book. Pauses on hover/focus and when the tab is hidden;
 * reduced-motion visitors see the first line only.
 */
function RotatingEpigraph({ lines }: { lines: string[] }) {
  const reduce = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || lines.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % lines.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, lines.length]);

  const line = lines[i];
  return (
    <blockquote
      className="intro-page__quote"
      data-long={line.length > 60 || undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="off"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.p>
      </AnimatePresence>
      {lines.length > 1 && !reduce && (
        <span className="intro-page__pager" aria-hidden="true">
          {lines.map((l, n) => (
            <i key={l} data-on={n === i || undefined} />
          ))}
        </span>
      )}
    </blockquote>
  );
}

export function IntroLeft() {
  return (
    <div className="intro-page intro-page--left">
      <p className="intro-page__running" style={step(0)}>
        Chapter 01 · Intro
      </p>
      <figure className="intro-page__epigraph" style={step(1)}>
        <span className="intro-page__ornament" aria-hidden="true" />
        <RotatingEpigraph lines={content.person.epigraphs} />
      </figure>
      <div className="intro-page__signature" style={step(2)}>
        <h1 className="intro-page__name" data-fx-heading>
          {content.person.name}
        </h1>
        <p className="intro-page__role">{content.person.role}</p>
      </div>
      <span className="intro-page__folio" style={step(0)}>
        i
      </span>
    </div>
  );
}

/** Sets the words before the first dash as a small-caps lead-in, the way book chapters open. */
function LeadIn({ text }: { text: string }) {
  const cut = text.indexOf(' — ');
  if (cut < 0) return <>{text}</>;
  return (
    <>
      <span className="intro-page__leadin">{text.slice(0, cut)}</span>
      {text.slice(cut)}
    </>
  );
}

export function IntroRight({ interactive = true }: { interactive?: boolean }) {
  return (
    <div className="intro-page intro-page--right">
      <p className="intro-page__running intro-page__running--right" style={step(1)}>
        <span className="intro-page__running-name">{content.person.name} · </span>Portfolio
      </p>
      <p className="intro-page__intro" style={step(2)}>
        <LeadIn text={content.person.intro} />
      </p>
      <div className="intro-page__meta intro-page__support" style={step(3)}>
        {content.person.introSupport.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <div className="intro-page__ctas" style={step(3.6)}>
        <a className="btn btn--solid" href="/mobile" data-fx-magnetic={interactive || undefined} data-fx-link={interactive || undefined}>
          Begin the journey ↓
        </a>
        <a className="btn" href={content.contact.resumeUrl} data-fx-magnetic={interactive || undefined}>
          Résumé
        </a>
      </div>
      <span className="intro-page__folio" style={step(1)}>
        ii
      </span>
    </div>
  );
}
