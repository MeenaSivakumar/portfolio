import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { CHAPTERS, type JourneyObject } from '../../shared/chapters';
import { useJourney } from '../../shared/journeyBus';
import { scrollToChapter } from '../../shared/scrollTo';
import type { VariantProps } from '../types';
import './progress.css';

function Rail() {
  const { chapterIndex, chapterProgress } = useJourney();
  const fill = (chapterIndex + chapterProgress) / (CHAPTERS.length - 1);
  return (
    <nav className="prog-rail" aria-label="Journey progress">
      <span className="prog-rail__line" aria-hidden="true">
        <i style={{ transform: `scaleY(${Math.min(1, fill)})` }} />
      </span>
      <ol>
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => scrollToChapter(c.id)}
              data-state={i < chapterIndex ? 'past' : i === chapterIndex ? 'current' : 'future'}
              aria-current={i === chapterIndex ? 'step' : undefined}
            >
              <span className="prog-rail__label">{c.label}</span>
              <span className="prog-rail__dot" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Ring() {
  const { chapterIndex, overall } = useJourney();
  const [open, setOpen] = useState(false);
  const c = CHAPTERS[chapterIndex];
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <div className="prog-ring">
      <AnimatePresence>
        {open && (
          <motion.ol
            className="prog-ring__menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {CHAPTERS.map((ch, i) => (
              <li key={ch.id}>
                <button
                  type="button"
                  aria-current={i === chapterIndex ? 'step' : undefined}
                  onClick={() => {
                    scrollToChapter(ch.id);
                    setOpen(false);
                  }}
                >
                  <span>{ch.index}</span> {ch.label}
                </button>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
      <button type="button" className="prog-ring__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`Chapter ${c.index}: ${c.label}. Open chapter menu`}>
        <svg viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r={R} className="prog-ring__track" />
          <circle cx="28" cy="28" r={R} className="prog-ring__value" strokeDasharray={C} strokeDashoffset={C * (1 - overall)} />
        </svg>
        <span className="prog-ring__n">{c.index}</span>
      </button>
      <AnimatePresence mode="wait">
        <motion.span
          key={c.id}
          className="prog-ring__label"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
        >
          {c.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const ICONS: Record<JourneyObject, ReactElement> = {
  book: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5.5C5 4.5 8.5 4.3 12 6c3.5-1.7 7-1.5 9-.5V19c-2-1-5.5-1.2-9 .5-3.5-1.7-7-1.5-9-.5z" />
      <path d="M12 6v13.5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 5h3" />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="10.5" rx="1.5" />
      <path d="M2 18.5h20" />
    </svg>
  ),
  page: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </svg>
  ),
};

function Objects() {
  const { chapterIndex, chapterProgress } = useJourney();
  const current = CHAPTERS[chapterIndex];
  return (
    <nav className="prog-objects" aria-label="Journey progress">
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          type="button"
          className="prog-objects__item"
          data-active={i === chapterIndex}
          data-past={i < chapterIndex}
          onClick={() => scrollToChapter(c.id)}
          aria-label={c.label}
          aria-current={i === chapterIndex ? 'step' : undefined}
        >
          {ICONS[c.object]}
          {i === chapterIndex && (
            <motion.span layoutId="prog-obj-pill" className="prog-objects__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }}>
              <span>{current.label}</span>
              <i style={{ transform: `scaleX(${chapterProgress})` }} />
            </motion.span>
          )}
        </button>
      ))}
    </nav>
  );
}

function TopBar() {
  const { chapterIndex, chapterProgress } = useJourney();
  return (
    <nav className="prog-top" aria-label="Journey progress">
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => scrollToChapter(c.id)}
          title={c.label}
          aria-label={c.label}
          aria-current={i === chapterIndex ? 'step' : undefined}
        >
          <i style={{ transform: `scaleX(${i < chapterIndex ? 1 : i === chapterIndex ? chapterProgress : 0})` }} />
          <span>{c.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function Progress({ variant }: VariantProps) {
  if (variant === 'ring') return <Ring />;
  if (variant === 'objects') return <Objects />;
  if (variant === 'topbar') return <TopBar />;
  return <Rail />;
}
