import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { content, type Project } from '../../content/content';
import { isWide } from '../../shared/breakpoints';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';
import { Reveal, SectionHead } from '../Reveal';

const pad = (n: number) => String(n).padStart(2, '0');

/** Real artwork when supplied; otherwise a typographic cover built from the project's own data. */
function Media({ project }: { project: Project }) {
  return project.image ? (
    <img src={project.image} alt={`${project.title} — app screens`} className="pmedia__img" loading="lazy" />
  ) : (
    <div className="pcover" aria-hidden="true">
      <span className="pcover__top">
        <span>{project.year}</span>
        {project.role && <span>{project.role}</span>}
      </span>
      <strong className="pcover__title">{project.title}</strong>
      <span className="pcover__tags">{project.tags.slice(0, 3).join(' · ')}</span>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="plinks">
      {project.liveUrl && (
        <a className="btn btn--solid" href={project.liveUrl} target="_blank" rel="noreferrer" data-fx-magnetic>
          Live site ↗
        </a>
      )}
      {project.storeUrl && (
        <a className="btn" href={project.storeUrl} target="_blank" rel="noreferrer" data-fx-magnetic>
          Play Store ↗
        </a>
      )}
      {project.codeUrl && (
        <a className="btn" href={project.codeUrl} target="_blank" rel="noreferrer" data-fx-magnetic>
          Code ↗
        </a>
      )}
    </div>
  );
}

/** Featured project as a contained case study: story on the left, the product on the right. */
function Featured({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <article ref={ref} className="fcase container" aria-labelledby="featured-title">
      <div className="fcase__panel">
        <div className="fcase__copy">
          <Reveal className="fcase__meta">
            <span className="fcase__badge">Featured</span>
            <span>{project.role}</span>
            <span>{project.year}</span>
          </Reveal>
          <h3 id="featured-title" className="fcase__title" data-fx-heading>
            {project.title}
          </h3>
          {project.tagline && <p className="fcase__tagline">{project.tagline}</p>}
          <p className="fcase__summary">{project.summary}</p>
          {project.highlights && (
            <ul className="fcase__highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <ul className="tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <ProjectLinks project={project} />
        </div>
        <motion.div
          className="fcase__media"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="fcase__media-inner" style={{ y }}>
            <Media project={project} />
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}

function GalleryCard({ project, n }: { project: Project; n: number }) {
  const href = project.liveUrl ?? project.codeUrl ?? '#';
  return (
    <article className="gcard" data-fx-card>
      <a href={href} className="gcard__link" target="_blank" rel="noreferrer" aria-label={`${project.title} — open project`}>
        <div className="gcard__media">
          <Media project={project} />
          <span className="gcard__view" aria-hidden="true">
            {project.liveUrl ? 'Visit site ↗' : 'View code ↗'}
          </span>
        </div>
      </a>
      <div className="gcard__body">
        <div className="gcard__meta">
          <span className="gcard__n">{pad(n)}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="gcard__title">{project.title}</h3>
        <p className="gcard__summary">{project.summary}</p>
        <ul className="tags tags--small">
          {project.tags.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Vertical scroll drives a horizontal track while the section is pinned. */
function HorizontalGallery({ items }: { items: Project[] }) {
  const reduce = usePrefersReducedMotion();
  const [narrow, setNarrow] = useState(() => !isWide());
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      setNarrow(!isWide());
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCurrent(Math.min(items.length, Math.max(1, Math.round(v * (items.length - 1)) + 1)));
  });

  const pinned = !reduce && !narrow;

  return (
    <div
      ref={sectionRef}
      className={`gallery ${pinned ? 'gallery--pinned' : 'gallery--native'}`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="gallery__sticky">
        <div className="gallery__bar container">
          <h3 className="gallery__heading">More work</h3>
          <span className="gallery__count" aria-hidden={!pinned}>
            {pad(current + 1)} <i>/</i> {pad(items.length + 1)}
          </span>
        </div>
        <motion.div ref={trackRef} className="gallery__track" style={pinned ? { x } : undefined} role="list" aria-label="More projects">
          {items.map((p, i) => (
            <div role="listitem" key={p.id}>
              <GalleryCard project={p} n={i + 2} />
            </div>
          ))}
          <div className="gallery__end" role="listitem">
            <span className="eyebrow">Keep exploring</span>
            <p>Practice projects, experiments and older work live on GitHub.</p>
            <a className="btn" href={content.links.github} target="_blank" rel="noreferrer" data-fx-magnetic>
              All repositories ↗
            </a>
          </div>
        </motion.div>
        {pinned && (
          <div className="gallery__progress container" aria-hidden="true">
            <motion.i style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const [first, ...rest] = content.projects;
  return (
    <section id="projects" data-chapter="projects" className="projects" aria-labelledby="projects-title">
      <SectionHead index="04" title={content.projectsTitle} id="projects-title" lead={content.projectsLead} epigraph={content.projectsEpigraph} />
      <Featured project={first} />
      <HorizontalGallery items={rest} />
    </section>
  );
}
