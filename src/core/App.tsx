import { MotionConfig } from 'framer-motion';
import { ChapterBreak } from './ChapterBreak';
import { ChapterTracker } from './ChapterTracker';
import { content } from '../content/content';
import { Header } from './Header';
import { Journey } from './journey/Journey';
import { JourneyStatic } from './journey/JourneyStatic';
import { Achievements } from './sections/Achievements';
import { Articles } from './sections/Articles';
import { Finale } from './sections/Finale';
import { Projects } from './sections/Projects';
import { Toolkit } from './sections/Toolkit';
import { Slot } from './Slot';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useSectionRouting } from './useSectionRouting';
import './core.css';

/**
 * The core portfolio. It knows nothing about experiments: it only exposes
 * <Slot> integration points, data-fx-* hooks on elements, and the journey bus.
 */
export function App() {
  const reduce = usePrefersReducedMotion();
  useSectionRouting();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="/projects">
        Skip to projects
      </a>
      <Header />
      <ChapterTracker />
      <main id="main">
        {reduce ? <JourneyStatic /> : <Journey />}
        <Slot name="after-journey" />
        <Projects />
        <Slot name="after-projects" />
        <ChapterBreak line={content.breaks.afterProjects} />
        <Achievements />
        <ChapterBreak line={content.breaks.afterAchievements} />
        <Articles />
        <Toolkit />
        <ChapterBreak line={content.breaks.afterArticles} />
        <Slot name="before-finale" />
        <Finale />
      </main>
      <Slot name="global" />
    </MotionConfig>
  );
}
