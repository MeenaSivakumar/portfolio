import { useEffect } from 'react';
import { content } from '../../content/content';
import { journeyBus } from '../../shared/journeyBus';
import { IntroLeft, IntroRight } from './IntroPages';
import { LaptopScreen, PhoneScreen } from './Screens';
import './journey.css';

/**
 * Reduced-motion version of the journey: the same three objects and the same copy,
 * laid out as calm, readable sections with no scroll-linked transforms.
 */
export function JourneyStatic() {
  useEffect(() => {
    journeyBus.publish({ headerVisible: true });
  }, []);

  return (
    <div className="journey-static">
      <section id="intro" data-chapter="intro" className="container journey-static__intro" aria-label="Introduction">
        <div className="book-static">
          <div>
            <IntroLeft />
          </div>
          <div>
            <IntroRight interactive={false} />
          </div>
        </div>
      </section>

      <section id="mobile" data-chapter="mobile" className="container journey-static__chapter" aria-labelledby="ch-mobile">
        <div className="journey-static__phone">
          <div className="device__screen">
            <PhoneScreen step={content.mobile.steps[0]} index={0} />
          </div>
        </div>
        <div>
          <span className="eyebrow">Chapter 02</span>
          <h2 id="ch-mobile" className="section-title">
            {content.mobile.chapterTitle}
          </h2>
          <p className="jpanel__lead">{content.mobile.lead}</p>
          <div className="journey-static__steps">
            {content.mobile.steps.map((s) => (
              <div className="jpanel__step" key={s.kicker}>
                <span className="jpanel__kicker">{s.kicker}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="web" data-chapter="web" className="container journey-static__chapter journey-static__chapter--web" aria-labelledby="ch-web">
        <div>
          <span className="eyebrow">Chapter 03</span>
          <h2 id="ch-web" className="section-title">
            {content.web.chapterTitle}
          </h2>
          <p className="jpanel__lead">{content.web.lead}</p>
          <div className="journey-static__steps">
            {content.web.steps.map((s) => (
              <div className="jpanel__step" key={s.kicker}>
                <span className="jpanel__kicker">{s.kicker}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="journey-static__laptop">
          <div className="device__screen">
            <LaptopScreen step={content.web.steps[0]} index={0} />
          </div>
        </div>
      </section>
    </div>
  );
}
