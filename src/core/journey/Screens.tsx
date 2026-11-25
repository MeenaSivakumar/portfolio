import type { DeviceStep } from '../../content/content';

/**
 * Interface states shown inside the devices. Until real screenshots are supplied
 * (step.image), each state renders a labelled wireframe so layouts can be judged.
 */

const Bars = ({ n, className = '' }: { n: number; className?: string }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <i key={i} className={`wf-line ${className}`} style={{ width: `${88 - ((i * 23) % 45)}%` }} />
    ))}
  </>
);

export function PhoneScreen({ step, index }: { step: DeviceStep; index: number }) {
  if (step.image) {
    return (
      <div className="pscreen pscreen--img">
        <img src={step.image} alt={step.screenLabel} className="screen-img" />
      </div>
    );
  }
  const v = index % 3;
  return (
    <div className={`pscreen pscreen--v${v}`} aria-hidden="true">
      <div className="wf-status">
        <i />
        <i />
      </div>
      {v === 0 && (
        <>
          <i className="wf-title" />
          <i className="wf-pill" />
          {Array.from({ length: 5 }, (_, i) => (
            <div className="wf-row" key={i}>
              <i className="wf-avatar" />
              <div>
                <Bars n={2} />
              </div>
            </div>
          ))}
        </>
      )}
      {v === 1 && (
        <>
          <i className="wf-media" />
          <i className="wf-title" />
          <Bars n={3} />
          <div className="wf-chips">
            <i />
            <i />
            <i />
          </div>
          <i className="wf-button" />
        </>
      )}
      {v === 2 && (
        <>
          <i className="wf-title" />
          <div className="wf-ring" />
          <div className="wf-bars">
            {[40, 70, 55, 90, 65, 80].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="wf-cards">
            <i />
            <i />
          </div>
        </>
      )}
      <div className="wf-tabbar">
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="screen-label">{step.screenLabel}</span>
    </div>
  );
}

/* ── Laptop: a code editor showing the chapter's stack ───────────────── */

type TokKind = 'com' | 'str' | 'kw' | 'key' | 'pun' | 'id' | 'sp';
type Tok = { t: string; k: TokKind; depth?: number };

/**
 * A tiny tokenizer — just enough highlighting for the small TS files in content.
 * Tracks bracket depth across lines so pairs can be coloured like a real editor.
 */
function tokenizeFile(source: string) {
  let depth = 0;
  return source.split('\n').map((line) => {
    const lead = line.match(/^ */)?.[0].length ?? 0;
    const body = line.slice(lead);
    const out: Tok[] = [];
    const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*')|\b(export|const|let|return)\b|([A-Za-z_$][\w$]*)(?=\s*:)|([[\]{}(),;:=.])|(\s+)|([^\s'[\]{}(),;:=./]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      if (m[1]) out.push({ t: m[1], k: 'com' });
      else if (m[2]) out.push({ t: m[2], k: 'str' });
      else if (m[3]) out.push({ t: m[3], k: 'kw' });
      else if (m[4]) out.push({ t: m[4], k: 'key' });
      else if (m[5]) {
        const ch = m[5];
        if ('[{('.includes(ch)) out.push({ t: ch, k: 'pun', depth: depth++ % 3 });
        else if (']})'.includes(ch)) out.push({ t: ch, k: 'pun', depth: --depth % 3 });
        else out.push({ t: ch, k: 'pun' });
      } else if (m[6]) out.push({ t: m[6], k: 'sp' });
      else out.push({ t: m[0], k: 'id' });
    }
    return { indent: Math.floor(lead / 2), tokens: out, length: line.length, kind: out[0]?.k ?? 'id' };
  });
}

const ActivityIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ACTIVITY = [
  'M6 3h8l4 4v14H6z M14 3v4h4', // files
  'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5 20 20', // search
  'M7 4v10 M7 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M17 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M17 10c0 4-10 2-10 6', // source control
  'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M15.5 13v7 M12 16.5h7', // extensions
];

export function LaptopScreen({ step, files }: { step: DeviceStep; index?: number; files?: string[] }) {
  if (step.image) {
    return (
      <div className="lscreen">
        <img src={step.image} alt={step.screenLabel} className="screen-img" />
      </div>
    );
  }
  const code = step.code ?? { file: 'stack.ts', source: `// ${step.screenLabel}` };
  const lines = tokenizeFile(code.source);
  const tree = files ?? [code.file];
  const symbol = code.source.match(/export const (\w+)/)?.[1];
  const last = lines[lines.length - 1];

  return (
    <div className="editor" aria-hidden="true">
      <div className="editor__bar">
        <span className="lscreen__dots editor__lights">
          <i />
          <i />
          <i />
        </span>
        <span className="editor__title">
          {code.file} — <b>journey</b>
        </span>
      </div>
      <div className="editor__main">
        <nav className="editor__activity">
          {ACTIVITY.map((d, i) => (
            <span key={i} className={i === 0 ? 'is-active' : undefined}>
              <ActivityIcon d={d} />
            </span>
          ))}
        </nav>
        <aside className="editor__tree">
          <span className="editor__tree-head">Explorer</span>
          <span className="editor__folder">▾ src</span>
          <span className="editor__folder editor__folder--sub">▾ journey</span>
          {tree.map((f) => (
            <span key={f} className={`editor__file ${f === code.file ? 'is-active' : ''}`}>
              <b>TS</b>
              {f}
            </span>
          ))}
        </aside>
        <div className="editor__pane">
          <div className="editor__tabs">
            {tree.map((f) => (
              <span key={f} className={`editor__tab ${f === code.file ? 'is-active' : ''}`}>
                <b>TS</b>
                {f}
                {f === code.file && <em>×</em>}
              </span>
            ))}
          </div>
          <div className="editor__crumbs">
            src <i>›</i> journey <i>›</i> {code.file}
            {symbol && (
              <>
                {' '}
                <i>›</i> <b>{symbol}</b>
              </>
            )}
          </div>
          <div className="editor__body" style={{ '--n': lines.length } as React.CSSProperties}>
            <pre className="editor__code">
              {lines.map((ln, i) => (
                <span
                  key={i}
                  className={`editor__line ${i === lines.length - 1 ? 'is-current' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="editor__ln">{i + 1}</span>
                  <span className="editor__src">
                    {Array.from({ length: ln.indent }, (_, g) => (
                      <span key={g} className="editor__indent">
                        {'  '}
                      </span>
                    ))}
                    {ln.tokens.map((tk, j) => (
                      <span key={j} className={tk.depth != null ? `tk-pun br-${tk.depth}` : `tk-${tk.k}`}>
                        {tk.t}
                      </span>
                    ))}
                    {i === lines.length - 1 && <span className="editor__caret" />}
                  </span>
                </span>
              ))}
            </pre>
            <div className="editor__minimap">
              {lines.map((ln, i) => (
                <i
                  key={i}
                  data-k={ln.kind}
                  style={{ width: `${Math.min(88, ln.length * 1.5)}%`, marginLeft: `${ln.indent * 6}%`, '--i': i } as React.CSSProperties}
                />
              ))}
              <span className="editor__minimap-view" />
            </div>
          </div>
        </div>
      </div>
      <div className="editor__status">
        <span className="editor__status-group">
          <span>⎇ main</span>
          <span>✓ No problems</span>
        </span>
        <span className="editor__status-group">
          <span>
            Ln {lines.length}, Col {last.length + 1}
          </span>
          <span className="editor__status-extra">Spaces: 2</span>
          <span className="editor__status-extra">UTF-8</span>
          <span>{'{ }'} TypeScript</span>
        </span>
      </div>
    </div>
  );
}
