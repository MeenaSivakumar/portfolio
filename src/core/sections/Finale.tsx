import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { content } from '../../content/content';
import { isWide } from '../../shared/breakpoints';
import { sendMessage } from '../../shared/sendMessage';
import { Book, type BookHandle } from '../journey/Book';
import { PageArt } from '../journey/PageArt';
import { BookCover, Endpaper, JOURNAL_TABS } from '../journey/Journey';
import { easeInOut, easeOut, lerp, seg } from '../journey/math';
import { Reveal } from '../Reveal';
import { useSectionProgress } from '../useSectionProgress';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

/**
 * The ending mirrors the opening: the same book returns, opens onto the About spread,
 * closes, and turns over to its back cover — which hands off to the Contact epilogue.
 *
 * Wide screens see the whole spread: monogram and quote on the left, the text on the right.
 * Phones (below 820px) zoom in: each page is the width of the screen, the camera rests on the
 * left page, then glides across to the right one.
 */
export function Finale() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<BookHandle>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState(() => measure());
  const zoom = dims.narrow;

  useEffect(() => {
    const onResize = () => setDims(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onProgress = useCallback(
    (p: number) => {
      const book = bookRef.current;
      if (reduce) {
        book?.setFlip(1);
        return;
      }
      // Phones get a longer section, so each page has time to be read.
      const T = zoom
        ? { open: [0.06, 0.28], text: [0.2, 0.28], textOut: [0.8, 0.84], close: [0.84, 0.92], turn: [0.92, 1], head: [0.1, 0.22] }
        : { open: [0.08, 0.42], text: [0.3, 0.42], textOut: [0.7, 0.76], close: [0.72, 0.86], turn: [0.86, 1], head: [0.12, 0.3] };
      const rise = easeOut(seg(p, 0, zoom ? 0.1 : 0.14));
      const open = seg(p, T.open[0], T.open[1]);
      const close = seg(p, T.close[0], T.close[1]);
      const turn = easeInOut(seg(p, T.turn[0], T.turn[1]));
      book?.setFlip(open * (1 - close));

      // Phones: rest on the left page once open, glide to the right page, re-centre to close.
      // Pages lie flat while being read; the desktop keeps its gentle tilt.
      let panX = 0;
      let flatten = 0;
      if (zoom) {
        const o = easeInOut(seg(p, T.open[0], T.open[1]));
        const g = easeInOut(seg(p, 0.48, 0.6));
        const back = easeInOut(seg(p, 0.8, 0.9));
        panX = (dims.pageW / 2) * o * (1 - 2 * g) * (1 - back);
        flatten = o * (1 - seg(p, T.textOut[0], T.close[1]));
      }
      const tilt = lerp(28, 8, rise) * (1 - turn * 0.6) * (1 - flatten);
      if (wrapRef.current) {
        const headRoom = 7 * (1 - seg(p, T.head[0], T.head[1] + 0.08));
        wrapRef.current.style.transform = `translate3d(${panX.toFixed(1)}px, ${lerp(30, 0, rise) + headRoom}vh, 0) rotateX(${tilt}deg) rotateY(${-180 * turn}deg) scale(${lerp(0.9, 1, rise)})`;
      }
      if (headRef.current) {
        const a = 1 - seg(p, T.head[0], T.head[1]);
        headRef.current.style.opacity = String(a);
        headRef.current.style.transform = `translate3d(0, ${-30 * (1 - a)}px, 0)`;
      }
      const root = book?.root;
      if (root) root.style.setProperty('--content-alpha', String(seg(p, T.text[0], T.text[1]) * (1 - seg(p, T.textOut[0], T.textOut[1]))));
    },
    [reduce, zoom, dims.pageW],
  );
  useSectionProgress(sectionRef, onProgress);

  const P = content.about.pageParagraphs;
  const page = (cls: string, children: ReactNode) => <div className={`intro-page about-page ${cls}`}>{children}</div>;
  const heading = (
    <>
      <p className="eyebrow">Chapter 07</p>
      <h3 className="about-page__title">{content.about.heading}</h3>
    </>
  );
  const paras = (list: string[]) => (
    <div className="about-copy">
      {list.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  );
  const next = (
    <a className="about-page__next" href="/contact" data-fx-link>
      Turn to the epilogue →
    </a>
  );

  const left = zoom
    ? page('', <>{heading}{paras(P.slice(0, 2))}</>)
    : page(
        '',
        <>
          {content.about.portrait ? (
            <img className="about-page__portrait" src={content.about.portrait} alt={content.person.name} />
          ) : (
            <div className="about-page__portrait about-page__portrait--mono" aria-hidden="true">
              {content.person.monogram}
            </div>
          )}
          <p className="intro-page__role">{content.person.name}</p>
          {content.about.quote.map((t) => (
            <p key={t} className="about-page__quote">
              {t}
            </p>
          ))}
          <span className="intro-page__folio">{content.about.signature}</span>
        </>,
      );
  const right = zoom
    ? page(
        'about-page--right',
        <>
          {paras(P.slice(2))}
          <div className="about-ending">
            <p className="about-page__quote">{content.about.quote[0]}</p>
            <span className="about-ending__sign">{content.about.signature}</span>
          </div>
          {next}
        </>,
      )
    : page('about-page--right', <>{heading}{paras(P)}{next}</>);

  return (
    <>
      <section
        ref={sectionRef}
        className={`finale ${zoom ? 'finale--zoom' : ''} ${reduce ? 'finale--static' : ''}`}
        style={reduce ? undefined : { height: dims.vh * (zoom ? 4.8 : 3.4) }}
        aria-labelledby="about-heading"
      >
        <div id="about" data-chapter="about" className="journey__marker" style={{ top: reduce ? 0 : dims.vh * 0.95 }} />
        <div
          className="finale__stage"
          style={{ height: reduce ? 'auto' : dims.vh, '--page-w': `${dims.pageW}px`, '--page-h': `${dims.pageH}px` } as React.CSSProperties}
        >
          <div className="finale__head" ref={headRef}>
            <span className="eyebrow">Chapter 07 · The last pages</span>
            <h2 id="about-heading" className="section-title" data-fx-heading>
              About
            </h2>
          </div>
          <div className="finale__book" ref={wrapRef}>
            <Book
              key={zoom ? 'zoom' : 'wide'}
              ref={bookRef}
              label="About"
              leaves={3}
              pageArt={(n) => <PageArt n={n + 2} />}
              cover={<BookCover />}
              insideCover={<Endpaper />}
              tabs={zoom ? undefined : JOURNAL_TABS}
              left={left}
              right={right}
              backCover={
                <div className="back-cover">
                  <span className="book-cover__mono">{content.person.monogram}</span>
                  <div className="back-cover__text back-cover__text--full">
                    {content.contact.signOff.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                  <div className="back-cover__text back-cover__text--short">
                    {content.contact.signOffShort.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                  <span className="book-cover__sub">Fin.</span>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}

function measure() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = !isWide(vw);
  if (narrow) {
    // Full-width pages: the open spread is wider than the screen and the camera pans across it.
    const pageW = Math.min(vw - 40, 480);
    const pageH = Math.min(vh * 0.66, pageW / 0.62, 720);
    return { vh, narrow, pageW, pageH };
  }
  const pageH = Math.min(vh * 0.64, 640, ((vw - 32) / 2) / 0.72);
  return { vh, narrow, pageW: pageH * 0.72, pageH };
}

type Field = 'name' | 'email' | 'message';
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string } | { kind: 'error'; reason: 'not-configured' | 'failed' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) errors.name = 'Please add your name.';
  if (!v.email.trim()) errors.email = 'Please add your email so I can reply.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'That email doesn’t look quite right.';
  if (!v.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [draftMail, setDraftMail] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    const found = validate(v);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: 'sending' });
    const res = await sendMessage({ ...v, name: v.name.trim(), email: v.email.trim(), botcheck: String(data.get('botcheck') ?? '') });
    if (res.ok) {
      form.reset();
      setStatus({ kind: 'sent', name: v.name.trim().split(/\s+/)[0] });
    } else {
      // Keep what they wrote; offer their own email app with the message filled in.
      const subject = encodeURIComponent(`Hello from ${v.name.trim()}`);
      const body = encodeURIComponent(v.message);
      setDraftMail(`mailto:${content.contact.email}?subject=${subject}&body=${body}`);
      setStatus({ kind: 'error', reason: res.reason });
    }
  };

  const fieldProps = (f: Field) => ({
    name: f,
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `contact-${f}-error` : undefined,
    onInput: () => errors[f] && setErrors((e) => ({ ...e, [f]: undefined })),
  });
  const fieldError = (f: Field) =>
    errors[f] ? (
      <em id={`contact-${f}-error`} className="contact__error">
        {errors[f]}
      </em>
    ) : null;

  return (
    <section id="contact" data-chapter="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Chapter 08 · Epilogue</span>
        </Reveal>
        <h2 id="contact-title" className="section-title" data-fx-heading data-fx-reveal>
          {content.contact.heading}
        </h2>
        <Reveal>
          <p className="contact__opener">{content.contact.opener}</p>
        </Reveal>
        <div className="contact__grid">
          <Reveal className="contact__intro">
            {content.contact.lead.map((t) => (
              <p key={t} className="section-lead">
                {t}
              </p>
            ))}
            <a className="contact__email" href={`mailto:${content.contact.email}`} data-fx-magnetic>
              {content.contact.email}
            </a>
            <ul className="contact__links">
              {content.contact.links.map((l, i) => (
                <li key={i}>
                  <a href={l.href}>
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={content.contact.resumeUrl}>
                  Résumé <span aria-hidden="true">↓</span>
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="contact__form" onSubmit={onSubmit} noValidate aria-busy={status.kind === 'sending'}>
              <label>
                <span>Name</span>
                <input {...fieldProps('name')} autoComplete="name" maxLength={120} required />
                {fieldError('name')}
              </label>
              <label>
                <span>Email</span>
                <input {...fieldProps('email')} type="email" inputMode="email" autoComplete="email" maxLength={200} required />
                {fieldError('email')}
              </label>
              <label>
                <span>Message</span>
                <textarea {...fieldProps('message')} rows={4} maxLength={5000} required />
                {fieldError('message')}
              </label>
              {/* Spam trap: hidden from people and screen readers, tempting to bots */}
              <input type="checkbox" name="botcheck" className="contact__trap" tabIndex={-1} aria-hidden="true" autoComplete="off" />
              <button className="btn btn--solid" type="submit" disabled={status.kind === 'sending'} data-fx-magnetic>
                {status.kind === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className={`contact__note contact__note--${status.kind}`} role="status" aria-live="polite">
                {status.kind === 'sent' && `Thank you, ${status.name} — your message is on its way. I’ll reply to you by email.`}
                {status.kind === 'error' && (
                  <>
                    {status.reason === 'not-configured'
                      ? 'The form can’t send messages just yet. '
                      : 'Your message couldn’t be sent just now. '}
                    <a href={draftMail}>Send it from your email app instead</a>, or write to {content.contact.email}.
                  </>
                )}
              </p>
            </form>
          </Reveal>
        </div>
      </div>

      <footer className="site-footer container">
        <span>
          © {new Date().getFullYear()} {content.person.name}
        </span>
        <span className="site-footer__line">{content.footerLine}</span>
        <button
          type="button"
          className="btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          data-fx-magnetic
        >
          Back to page one ↑
        </button>
      </footer>
    </section>
  );
}
