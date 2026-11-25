import { useEffect, useState } from 'react';
import { content } from '../content/content';
import { CHAPTERS } from '../shared/chapters';
import { useJourney } from '../shared/journeyBus';

const NAV = CHAPTERS.filter((c) => c.id !== 'intro');

export function Header() {
  const visible = useJourney((s) => s.headerVisible);
  const active = useJourney((s) => s.chapter);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header" data-visible={visible || open}>
      <div className="site-header__inner">
        <a className="site-header__brand" href="/" data-fx-link aria-label={`${content.person.name} — back to the start`}>
          <span className="site-header__mono">{content.person.monogram}</span>
          <span className="site-header__name">{content.person.name}</span>
        </a>

        <nav aria-label="Chapters" className="site-header__nav">
          <ul data-fx-nav-group>
            {NAV.map((c) => (
              <li key={c.id}>
                <a
                  href={c.path}
                  data-fx-nav
                  data-fx-link
                  aria-current={active === c.id ? 'location' : undefined}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn site-header__cta" href={content.contact.resumeUrl} data-fx-magnetic>
          Résumé
        </a>

        {/* Empty integration point: experiments may portal small controls here. */}
        <div className="site-header__fx" data-fx-header-slot />

        <button
          type="button"
          className="site-header__menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <i />
          <i />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open} hidden={!open}>
        <ol>
          {NAV.map((c) => (
            <li key={c.id}>
              <a href={c.path} onClick={() => setOpen(false)} aria-current={active === c.id ? 'location' : undefined}>
                <span>{c.index}</span>
                {c.label}
              </a>
            </li>
          ))}
          <li>
            <a href={content.contact.resumeUrl} onClick={() => setOpen(false)}>
              <span>↓</span>
              Résumé
            </a>
          </li>
        </ol>
      </div>
    </header>
  );
}
