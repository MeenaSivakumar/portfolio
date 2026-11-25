import { useEffect } from 'react';
import { ChapterTracker } from '../../core/ChapterTracker';
import { CHAPTERS } from '../../shared/chapters';
import { journeyBus, useJourney } from '../../shared/journeyBus';
import { createSlotRenderer } from '../host';
import { resolveSelection } from '../resolve';
import './sandbox.css';

/**
 * Isolated stage: renders the selected experiment(s) against neutral content that
 * carries every data-fx-* hook and chapter anchor, without the core journey.
 * URL: /sandbox.html?fx=terminal:dock
 */
const selection = resolveSelection();
const render = createSlotRenderer(selection);
const active = Object.entries(selection).filter(([, s]) => s.enabled);

function BusReadout() {
  const s = useJourney();
  return (
    <div className="sb-bus" aria-hidden="true">
      <span>bus</span> {s.chapter} · chapter {Math.round(s.chapterProgress * 100)}% · page {Math.round(s.overall * 100)}%
    </div>
  );
}

function Nav() {
  const chapter = useJourney((s) => s.chapter);
  return (
    <header className="sb-header">
      <strong>Sandbox</strong>
      <nav aria-label="Sample navigation">
        <ul data-fx-nav-group>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.anchor}`} data-fx-nav data-fx-link aria-current={chapter === c.id ? 'location' : undefined}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Sandbox() {
  useEffect(() => {
    journeyBus.publish({ headerVisible: true });
  }, []);

  return (
    <>
      <Nav />
      <ChapterTracker />
      <main className="sb">
        <p className="sb-note">
          {active.length ? (
            <>
              Previewing <b>{active.map(([id, s]) => `${id} · ${s.variant}`).join(', ')}</b> in isolation. The content below is neutral sample material carrying every
              data-fx hook.
            </>
          ) : (
            'No experiment selected.'
          )}
        </p>
        {CHAPTERS.map((c, i) => (
          <section key={c.id} id={c.anchor} data-chapter={c.id} className="sb-section">
            <span className="eyebrow" data-fx-float>
              Sample chapter {c.index}
            </span>
            <h2 className="sb-title" data-fx-heading data-fx-reveal>
              {c.label} heading
            </h2>
            <div className="sb-row">
              <a className="btn btn--solid" href="#" data-fx-magnetic onClick={(e) => e.preventDefault()}>
                Magnetic button
              </a>
              <a className="btn" href={`#${CHAPTERS[(i + 1) % CHAPTERS.length].anchor}`} data-fx-link data-fx-magnetic>
                Jump to next →
              </a>
            </div>
            <div className="sb-cards">
              {[1, 2, 3].map((n) => (
                <article key={n} className="sb-card" data-fx-card>
                  <div className="ph">
                    <span>[Card {n}]</span>
                  </div>
                  <h3>Sample card</h3>
                  <p>Hover me to see card treatments.</p>
                </article>
              ))}
            </div>
            {i === 2 && render('after-journey')}
            {i === 3 && render('after-projects')}
            {i === 5 && render('before-finale')}
          </section>
        ))}
      </main>
      {render('global')}
      <BusReadout />
    </>
  );
}
