import { motion } from 'framer-motion';
import { content } from '../../content/content';
import { TOOL_LOGOS } from '../../content/toolLogos';
import { SectionHead } from '../Reveal';

/**
 * The stack as stickers on a journal page, clustered by languages / mobile / web / tools with
 * small handwritten notes. Core tools are solid ink labels, the rest white stickers. Practices sit
 * at the foot of the page as a ticked checklist. Reads from the same TOOLKIT list as the laptop.
 */
/** The tool's logo in currentColor; tools without a published icon get a small neutral mark. */
function ToolLogo({ name }: { name: string }) {
  const logo = TOOL_LOGOS[name];
  return (
    <svg className="tk-logo" viewBox={logo?.viewBox ?? '0 0 24 24'} aria-hidden="true" focusable="false">
      {logo ? (
        logo.paths.map((d, i) => <path key={i} d={d} fill="currentColor" />)
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  );
}

export function Toolkit() {
  const t = content.toolkit;
  let n = 0; // running index, so pop-in delays continue across clusters

  return (
    <section id="toolkit" data-chapter="toolkit" className="toolkit" aria-labelledby="toolkit-title">
      <SectionHead index="ix" eyebrow={t.eyebrow} title={t.title} id="toolkit-title" lead={t.lead} />

      <div className="container">
        <div className="tk-page">
          <div className="tk-clusters">
            {t.groups.map((g) => (
              <div key={g.label} className="tk-cluster">
                <h3 className="tk-note">{g.label}</h3>
                <ul className="tk-stickers" aria-label={g.label}>
                  {g.items.map((label) => {
                    const i = n++;
                    const core = t.core.includes(label);
                    return (
                      <motion.li
                        key={label}
                        className={`tk-sticker ${core ? 'tk-sticker--core' : ''}`}
                        initial={{ opacity: 0, scale: 0.6, y: 14 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                        transition={{ type: 'spring', stiffness: 420, damping: 22, delay: i * 0.035 }}
                      >
                        <span>
                          <ToolLogo name={label} />
                          {label}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <ul className="tk-checklist" aria-label="Engineering practices">
            {t.practices.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="tk-check" aria-hidden="true" />
                {p}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
