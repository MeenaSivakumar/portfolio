import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { content } from '../../content/content';
import { CHAPTERS } from '../../shared/chapters';
import { journeyBus } from '../../shared/journeyBus';
import { readStore, writeStore } from '../../shared/safeStorage';
import { scrollToChapter } from '../../shared/scrollTo';
import { Book, type BookHandle } from './Book';
import { IntroLeft, IntroRight } from './IntroPages';
import { PageArt } from './PageArt';
import { clamp, easeIn, easeInOut, easeOut, lerp, seg, stepPos } from './math';
import { computeMetrics, type Metrics } from './metrics';
import { LaptopScreen, PhoneScreen } from './Screens';
import './journey.css';

/**
 * Scroll timeline, in viewport-heights ("p" units) of the pinned journey:
 *
 *  0.0 – 0.55  Intro spread holds (after the autoplay opening)
 *  0.3 – 1.35  Content fades, camera pulls back, the book closes, header appears
 *  1.55 – 2.4  Closed cover becomes the smartphone and docks to one side
 *  2.4 – 5.4   Mobile chapter: three interface states
 *  5.4 – 7.1   Phone travels to centre, rotates, widens and grows a keyboard → laptop
 *  7.1 – 10.1  Web chapter: three interface states
 * 10.1 – 11.0  Camera flies into the laptop screen → Projects
 */
const TOTAL = 11;
const MOBILE_START = 2.4;
const WEB_START = 7.1;
const INTRO_MS = 3600;
const SEEN_KEY = 'journey:intro-seen';

const mobileSteps = content.mobile.steps;
const webSteps = content.web.steps;
const webFiles = webSteps.map((s) => s.code?.file).filter((f): f is string => !!f);

interface PanelDef {
  a: number;
  b: number;
}

/** firstIn: when the chapter's first panel starts fading in, relative to the chapter start */
function stepRange(start: number, i: number, n: number, firstIn = -0.3): PanelDef {
  return {
    a: i === 0 ? start + firstIn : start + i - 0.15,
    b: i === n - 1 ? start + n + 0.05 : start + i + 1 - 0.1,
  };
}

/*
 * Panels must never share the screen with the device. The transformation caption lives on the
 * phone's own (blank) screen, and the Web chapter's first panel waits until the laptop has slid aside.
 */
const panelDefs: PanelDef[] = [
  ...mobileSteps.map((_, i) => stepRange(MOBILE_START, i, mobileSteps.length, -0.17)),
  ...webSteps.map((_, i) => stepRange(WEB_START, i, webSteps.length, 0.17)),
];

function useViewportMetrics() {
  const [m, setM] = useState<Metrics>(() => computeMetrics(window.innerWidth, window.innerHeight));
  useEffect(() => {
    let last = { w: window.innerWidth, h: window.innerHeight };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Ignore small height changes caused by mobile browser chrome showing/hiding.
      if (w === last.w && Math.abs(h - last.h) < 120) return;
      last = { w, h };
      setM(computeMetrics(w, h));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return m;
}

export function Journey() {
  const m = useViewportMetrics();
  const sectionRef = useRef<HTMLElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const bookWrapRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<BookHandle>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const bezelRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const camDotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const phoneLayerRef = useRef<HTMLDivElement>(null);
  const phoneStripRef = useRef<HTMLDivElement>(null);
  const laptopLayerRef = useRef<HTMLDivElement>(null);
  const laptopScreensRef = useRef<(HTMLDivElement | null)[]>([]);
  const exitCardRef = useRef<HTMLDivElement>(null);
  const thoughtRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const introT = useRef(readStore(SEEN_KEY, false, 'session') ? 1 : 0);
  const pRef = useRef(0);
  const metricsRef = useRef(m);
  metricsRef.current = m;
  const [introDone, setIntroDone] = useState(introT.current >= 1);

  /** Compose every visual property from (scroll p, intro autoplay t). Pure style writes. */
  const render = useCallback(() => {
    const p = pRef.current;
    const it = introT.current;
    const M = metricsRef.current;

    // ── Book ──────────────────────────────────────────────
    const appear = easeOut(seg(it, 0, 0.16));
    const flipIntro = seg(it, 0.14, 0.8);
    const closeT = seg(p, 0.55, 1.35);
    bookRef.current?.setFlip(flipIntro * (1 - closeT));
    const zoomIn = easeInOut(seg(it, 0.62, 0.95));
    const zoomOut = easeInOut(seg(p, 0.3, 1.2));
    const zoom = lerp(0.86, 1, appear) * lerp(1, M.bookZoom, zoomIn * (1 - zoomOut));
    if (cameraRef.current) {
      cameraRef.current.style.transform = `translate3d(0, ${lerp(40, 0, appear)}px, 0) scale(${zoom})`;
    }
    const bookAlpha = appear * (1 - seg(p, 1.56, 1.66));
    if (bookWrapRef.current) {
      const tilt = lerp(26, 10, appear) * (1 - easeInOut(seg(p, 0.6, 1.3)));
      bookWrapRef.current.style.transform = `rotateX(${tilt}deg)`;
      bookWrapRef.current.style.opacity = String(bookAlpha);
      bookWrapRef.current.style.visibility = bookAlpha < 0.01 ? 'hidden' : 'visible';
    }
    const contentAlpha = seg(it, 0.8, 1) * (1 - seg(p, 0.3, 0.6));
    const root = bookRef.current?.root;
    if (root) {
      root.style.setProperty('--content-alpha', String(contentAlpha));
      root.dataset.interactive = contentAlpha > 0.6 ? 'true' : 'false';
    }

    // ── Device: cover → phone → laptop ───────────────────
    const dev = deviceRef.current;
    if (dev) {
      const toPhone = easeInOut(seg(p, 1.62, 2.35));
      const dock = easeInOut(seg(p, 1.9, 2.45));
      const toCentre = easeInOut(seg(p, 5.4, 5.85));
      const rotT = easeInOut(seg(p, 5.8, 6.25));
      const swapped = p >= 6.25;
      const grow = easeInOut(seg(p, 6.25, 6.85));
      const toSide = easeInOut(seg(p, 6.9, 7.35));
      const exitCentre = easeInOut(seg(p, 10.1, 10.5));
      const exitT = easeIn(seg(p, 10.3, 10.98));

      let w: number, h: number, r: number, bezel: number, rot: number;
      if (!swapped) {
        w = lerp(M.pageW, M.phoneW, toPhone);
        h = lerp(M.pageH, M.phoneH, toPhone);
        r = lerp(M.pageW * 0.045, M.phoneR, toPhone);
        bezel = lerp(0, M.phoneBezel, toPhone);
        rot = -90 * rotT;
      } else {
        // At 90° a portrait w×h is visually identical to an upright h×w — swap and keep growing.
        w = lerp(M.phoneH, M.laptopW, grow);
        h = lerp(M.phoneW, M.laptopH, grow);
        r = lerp(M.phoneR, M.laptopR, grow);
        bezel = lerp(M.phoneBezel, M.laptopBezel, grow);
        rot = 0;
      }

      let x = lerp(0, M.phoneX, dock);
      let y = lerp(0, M.deviceY, dock);
      x = lerp(x, 0, toCentre);
      y = lerp(y, M.narrow ? M.deviceY : 0, toCentre);
      const laptopY = M.narrow ? M.deviceY : -M.laptopH * 0.06;
      x = lerp(x, M.laptopX, toSide);
      y = lerp(y, laptopY, seg(p, 6.5, 7.0));
      x = lerp(x, 0, exitCentre);
      y = lerp(y, 0, exitCentre);

      const exitScale = Math.max(M.vw / M.laptopW, M.vh / M.laptopH) * 1.25;
      const scale = lerp(1, exitScale, exitT);
      const tilt = seg(p, 2.0, 2.5) * (1 - seg(p, 5.3, 5.7)) * (M.narrow ? 0 : 1);
      const devAlpha = seg(p, 1.55, 1.66) * (1 - seg(p, 10.75, 10.99));

      dev.style.width = `${w}px`;
      dev.style.height = `${h}px`;
      dev.style.borderRadius = `${r}px`;
      dev.style.opacity = String(devAlpha);
      dev.style.visibility = devAlpha < 0.01 ? 'hidden' : 'visible';
      dev.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateY(${8 * tilt}deg) rotateX(${2 * tilt}deg) rotate(${rot}deg) scale(${scale})`;

      if (bezelRef.current) {
        bezelRef.current.style.padding = `${bezel}px`;
        bezelRef.current.style.setProperty('--inner-r', `${Math.max(2, r - bezel)}px`);
      }
      if (coverRef.current) coverRef.current.style.opacity = String(1 - seg(p, 1.75, 2.2));
      if (notchRef.current) notchRef.current.style.opacity = String(seg(p, 2.0, 2.3) * (1 - seg(p, 5.6, 5.9)));
      if (camDotRef.current) camDotRef.current.style.opacity = String(seg(p, 6.5, 6.8));
      if (glowRef.current) glowRef.current.style.opacity = String(seg(p, 5.45, 5.8) * (1 - seg(p, 6.6, 6.95)));
      if (thoughtRef.current) {
        // The transformation line appears on the phone's blank screen, and leaves before it turns sideways.
        const a = seg(p, 5.55, 5.72) * (1 - seg(p, 5.9, 6.02));
        thoughtRef.current.style.opacity = String(a);
        thoughtRef.current.style.transform = `translate3d(0, ${(1 - seg(p, 5.55, 5.72)) * 6}%, 0)`;
      }

      const phoneAlpha = seg(p, 2.05, 2.35) * (1 - seg(p, 5.45, 5.75));
      if (phoneLayerRef.current) phoneLayerRef.current.style.opacity = String(phoneAlpha);
      if (phoneStripRef.current) {
        const pos = stepPos(p - MOBILE_START, mobileSteps.length);
        phoneStripRef.current.style.transform = `translate3d(${-pos * 100}%, 0, 0)`;
      }

      const laptopAlpha = seg(p, 6.75, 7.05);
      if (laptopLayerRef.current) laptopLayerRef.current.style.opacity = String(laptopAlpha);
      const lpos = stepPos(p - WEB_START, webSteps.length);
      laptopScreensRef.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(lpos - i);
        el.style.opacity = String(clamp(1 - d));
        el.style.transform = `scale(${1 + clamp(d) * 0.04}) translate3d(0, ${(i - lpos) * 6}%, 0)`;
        // Lines of each file "type in" as the visitor scrolls into its step.
        el.style.setProperty('--reveal', String(seg(p, WEB_START + i - 0.35, WEB_START + i + 0.3)));
      });
      if (exitCardRef.current) exitCardRef.current.style.opacity = String(seg(p, 10.1, 10.35));

      if (baseRef.current) {
        const b = easeOut(seg(p, 6.55, 6.95)) * (1 - seg(p, 10.1, 10.35));
        baseRef.current.style.opacity = String(b);
        baseRef.current.style.transform = `translateX(-50%) scaleX(${lerp(0.55, 1, b)})`;
      }
    }

    // ── Text panels ──────────────────────────────────────
    panelDefs.forEach((d, i) => {
      const el = panelRefs.current[i];
      if (!el) return;
      const fin = seg(p, d.a, d.a + 0.22);
      const fout = 1 - seg(p, d.b - 0.22, d.b);
      const a = Math.min(fin, fout);
      el.style.opacity = String(a);
      el.style.visibility = a < 0.02 ? 'hidden' : 'visible';
      el.style.transform = `translate3d(0, ${(1 - fin) * 28 - (1 - fout) * 28}px, 0)`;
    });

    if (hintRef.current) {
      hintRef.current.style.opacity = String(seg(it, 0.92, 1) * (1 - seg(p, 0.05, 0.3)));
    }
    if (skipRef.current) {
      const show = p < 1.4;
      skipRef.current.dataset.show = show ? 'true' : 'false';
      skipRef.current.tabIndex = show ? 0 : -1;
    }

    journeyBus.publish({ headerVisible: p > 1.0 });
  }, []);

  // Scroll → p, eased: wheel steps glide instead of jumping. Big jumps (nav links) snap.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let target = 0;
    let follow = 0;
    let last = 0;
    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = (scrollable > 0 ? clamp(-rect.top / scrollable) : 0) * TOTAL;
    };
    const step = (now: number) => {
      follow = 0;
      const dt = Math.min(64, now - (last || now));
      last = now;
      const diff = target - pRef.current;
      if (Math.abs(diff) > 1.2) pRef.current = target;
      else pRef.current += diff * (1 - Math.exp(-dt / 70));
      if (Math.abs(target - pRef.current) < 0.0008) pRef.current = target;
      // Any real scroll during the autoplay completes it — the visitor is in control.
      if (introT.current < 1 && pRef.current > 0.02) finishIntro();
      render();
      if (pRef.current !== target) follow = requestAnimationFrame(step);
      else last = 0;
    };
    const onScroll = () => {
      readTarget();
      if (!follow) {
        last = performance.now();
        follow = requestAnimationFrame(step);
      }
    };
    readTarget();
    pRef.current = target;
    if (introT.current < 1 && pRef.current > 0.02) finishIntro();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(follow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, m]);

  // Intro autoplay timeline
  const finishIntro = useCallback(() => {
    introT.current = 1;
    writeStore(SEEN_KEY, true, 'session');
    setIntroDone(true);
    render();
  }, [render]);

  useEffect(() => {
    if (introT.current >= 1) {
      render();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (introT.current >= 1) return;
      introT.current = clamp((now - start) / INTRO_MS);
      render();
      if (introT.current < 1) raf = requestAnimationFrame(tick);
      else finishIntro();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [render, finishIntro]);

  const skip = useCallback(() => {
    finishIntro();
    journeyBus.publish({ headerVisible: true });
    scrollToChapter('mobile', 'auto');
  }, [finishIntro]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pRef.current < 1.4) skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  const vh = m.vh;
  let panelIndex = 0;
  const nextPanelRef = () => {
    const i = panelIndex++;
    return (el: HTMLDivElement | null) => {
      panelRefs.current[i] = el;
    };
  };

  return (
    <section
      className="journey"
      ref={sectionRef}
      style={{ height: (TOTAL + 1) * vh }}
      aria-label="Journey: book, phone and laptop"
      data-intro-done={introDone}
    >
      <div id="intro" data-chapter="intro" className="journey__marker" style={{ top: 0 }} />
      <div id="mobile" data-chapter="mobile" className="journey__marker" style={{ top: MOBILE_START * vh }} />
      <div id="web" data-chapter="web" className="journey__marker" style={{ top: WEB_START * vh }} />

      <div
        className={`journey__stage ${m.narrow ? 'is-narrow' : ''}`}
        style={
          {
            height: vh,
            '--page-w': `${m.pageW}px`,
            '--page-h': `${m.pageH}px`,
          } as React.CSSProperties
        }
      >
        {/* Scene 1 — the book */}
        <div className="journey__camera" ref={cameraRef}>
          <div className="journey__book" ref={bookWrapRef}>
            <Book
              ref={bookRef}
              label="Introduction"
              leaves={4}
              cover={<BookCover />}
              insideCover={<Endpaper />}
              tabs={JOURNAL_TABS}
              pageArt={(n) => <PageArt n={n} />}
              left={<IntroLeft />}
              right={<IntroRight />}
            />
          </div>
        </div>

        {/* Scenes 2–4 — one continuous device */}
        <div className="device" ref={deviceRef} aria-hidden="true">
          <div className="device__cover" ref={coverRef}>
            <BookCover />
          </div>
          <div className="device__bezel" ref={bezelRef}>
            <div className="device__screen">
              <div className="device__layer" ref={phoneLayerRef}>
                <div className="device__strip" ref={phoneStripRef}>
                  {mobileSteps.map((s, i) => (
                    <PhoneScreen key={i} step={s} index={i} />
                  ))}
                </div>
              </div>
              <div className="device__layer" ref={laptopLayerRef}>
                {webSteps.map((s, i) => (
                  <div
                    key={i}
                    className="device__lstate"
                    ref={(el) => {
                      laptopScreensRef.current[i] = el;
                    }}
                  >
                    <LaptopScreen step={s} index={i} files={webFiles} />
                  </div>
                ))}
                <div className="device__exit" ref={exitCardRef}>
                  <span className="eyebrow">Chapter 04</span>
                  <strong>Projects</strong>
                </div>
              </div>
              <div className="device__glow" ref={glowRef} />
              <div className="device__thought" ref={thoughtRef}>
                <span className="device__thought-kicker">Chapter 03 · Transformation</span>
                <p className="device__thought-quote">{content.transform.caption}</p>
                <p className="device__thought-note">{content.transform.note}</p>
              </div>
            </div>
            <div className="device__notch" ref={notchRef} />
            <div className="device__camdot" ref={camDotRef} />
          </div>
          <div className="device__base" ref={baseRef}>
            <i />
          </div>
        </div>

        {/* Copy that travels alongside the objects */}
        <div className="journey__panels">
          {mobileSteps.map((s, i) => (
            <div key={`m${i}`} className="jpanel jpanel--right" ref={nextPanelRef()}>
              {i === 0 && (
                <header className="jpanel__chapter">
                  <span className="eyebrow">Chapter 02</span>
                  <h2 data-fx-heading>{content.mobile.chapterTitle}</h2>
                  <p className="jpanel__lead">{content.mobile.lead}</p>
                  <p className="jpanel__epigraph">{content.mobile.epigraph}</p>
                </header>
              )}
              <div className="jpanel__step">
                <span className="jpanel__kicker">
                  {s.kicker} / {String(mobileSteps.length).padStart(2, '0')}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
          {webSteps.map((s, i) => (
            <div key={`w${i}`} className="jpanel jpanel--left" ref={nextPanelRef()}>
              {i === 0 && (
                <header className="jpanel__chapter">
                  <span className="eyebrow">Chapter 03</span>
                  <h2 data-fx-heading>{content.web.chapterTitle}</h2>
                  <p className="jpanel__lead">{content.web.lead}</p>
                  <p className="jpanel__epigraph">{content.web.epigraph}</p>
                </header>
              )}
              <div className="jpanel__step">
                <span className="jpanel__kicker">
                  {s.kicker} / {String(webSteps.length).padStart(2, '0')}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="journey__hint" ref={hintRef} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>

      <button type="button" className="skip-intro" ref={skipRef} onClick={skip} data-show="true">
        Skip intro <kbd>Esc</kbd>
      </button>
    </section>
  );
}

/** Journal cover: stitched edge, elastic band and a paper label plate. */
export function BookCover() {
  return (
    <div className="book-cover">
      <span className="book-cover__stitch" aria-hidden="true" />
      <div className="book-cover__plate">
        <span className="book-cover__kicker">Journey</span>
        <span className="book-cover__title">{content.person.name}</span>
        <span className="book-cover__vol">vol. 01</span>
      </div>
      <span className="book-cover__sub">{content.person.coverSubtitle}</span>
      <span className="book-cover__band" aria-hidden="true" />
    </div>
  );
}

/** Inside of the front cover, like the first page of a notebook. */
export function Endpaper() {
  return (
    <div className="book__endpaper">
      <span className="book__endpaper-label">This journal belongs to</span>
      <span className="book__endpaper-name">{content.person.name}</span>
    </div>
  );
}

/** The fore-edge tabs: one per chapter the visitor can jump to. */
export const JOURNAL_TABS = CHAPTERS.filter((c) => ['mobile', 'web', 'projects', 'achievements', 'articles'].includes(c.id)).map((c) => ({
  // 'Achievements' is headed "My Journey" on the page — and is too long for a tab.
  label: c.id === 'achievements' ? 'Journey' : c.label,
  href: c.path,
}));
