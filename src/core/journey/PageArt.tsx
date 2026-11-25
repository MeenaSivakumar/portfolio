import type { CSSProperties, ReactNode } from 'react';
import './page-art.css';

/**
 * Animated ink sketches for the pages that flip past while a book turns —
 * a small "making of" story: an idea → a sketch → code → building → tools → connecting → shipping.
 * Animations only run while the book is mid-turn (see .book[data-turning]).
 */

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function Idea() {
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <g className="pa-rays">
        {[
          [100, 18, 100, 6],
          [58, 34, 49, 25],
          [142, 34, 151, 25],
          [42, 72, 30, 72],
          [158, 72, 170, 72],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={d(i * 120)} />
        ))}
      </g>
      <path
        className="pa-draw"
        pathLength={1}
        d="M100 32c-22 0-38 16-38 37 0 13 7 22 14 30 5 6 8 11 8 18v6h32v-6c0-7 3-12 8-18 7-8 14-17 14-30 0-21-16-37-38-37z"
      />
      <path className="pa-draw" pathLength={1} style={d(500)} d="M86 131h28M89 140h22M94 148h12" />
      <path className="pa-draw pa-thin" pathLength={1} style={d(800)} d="M92 117V96l8 8 8-8v21" />
    </svg>
  );
}

function Sketch() {
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <rect className="pa-draw" pathLength={1} x="68" y="8" width="64" height="144" rx="12" />
      <rect className="pa-draw pa-thin" pathLength={1} style={d(350)} x="78" y="26" width="44" height="30" rx="4" />
      <path className="pa-draw pa-thin" pathLength={1} style={d(650)} d="M78 66h44M78 74h30" />
      <rect className="pa-draw pa-thin" pathLength={1} style={d(900)} x="78" y="84" width="20" height="20" rx="3" />
      <rect className="pa-draw pa-thin" pathLength={1} style={d(1050)} x="102" y="84" width="20" height="20" rx="3" />
      <rect className="pa-draw pa-thin" pathLength={1} style={d(1250)} x="78" y="114" width="44" height="12" rx="6" />
      <g className="pa-pencil">
        <path d="M150 112l26-26 8 8-26 26-11 3z" />
        <path d="M170 92l8 8" />
      </g>
    </svg>
  );
}

function Code() {
  const rows = [70, 110, 90, 54, 96];
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <text x="100" y="40" textAnchor="middle" className="pa-glyph">
        {'</>'}
      </text>
      {rows.map((w, i) => (
        <rect key={i} className="pa-type" style={d(i * 260)} x={40 + (i % 2) * 14} y={62 + i * 16} width={w} height="6" rx="3" />
      ))}
      <rect className="pa-caret" x="44" y="140" width="3" height="12" />
    </svg>
  );
}

function Blocks() {
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <line x1="40" y1="142" x2="160" y2="142" className="pa-line" />
      <rect className="pa-drop" style={d(0)} x="56" y="112" width="40" height="30" rx="4" />
      <rect className="pa-drop" style={d(300)} x="104" y="112" width="40" height="30" rx="4" />
      <rect className="pa-drop" style={d(600)} x="80" y="78" width="40" height="30" rx="4" />
      <rect className="pa-drop pa-drop--accent" style={d(900)} x="80" y="44" width="40" height="30" rx="4" />
    </svg>
  );
}

function Tools() {
  const sats: { x: number; y: number; node: ReactNode }[] = [
    { x: 100, y: 22, node: <text className="pa-mini">{'>_'}</text> },
    { x: 162, y: 80, node: <path d="M-6-6h12v12h-12zM-3-3h6v6h-6z" /> },
    { x: 100, y: 138, node: <path d="M-4-7v14M-4 7a3 3 0 1 0 0 .1M5-7a3 3 0 1 0 0 .1M5-4c0 6-9 3-9 9" /> },
    { x: 38, y: 80, node: <path d="M-7-4c0-5 14-5 14 0v8c0 5-14 5-14 0zM-7-4c0 5 14 5 14 0" /> },
  ];
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <circle cx="100" cy="80" r="58" className="pa-orbit-ring" />
      <text x="100" y="88" textAnchor="middle" className="pa-glyph pa-glyph--small">
        {'{ }'}
      </text>
      <g className="pa-orbit">
        {sats.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <g className="pa-counter" style={{ transformOrigin: '0 0' }}>
              <circle r="13" className="pa-sat" />
              <g className="pa-sat-icon">{s.node}</g>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Network() {
  const nodes = [
    [40, 40],
    [160, 36],
    [100, 82],
    [44, 128],
    [158, 124],
  ];
  const links = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [0, 3],
  ];
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      {links.map(([a, b], i) => (
        <line
          key={i}
          className="pa-flow"
          style={d(i * 200)}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 14 : 9} className={`pa-node ${i === 2 ? 'pa-node--hub' : ''}`} style={d(i * 180)} />
      ))}
    </svg>
  );
}

function Ship() {
  return (
    <svg viewBox="0 0 200 160" className="pa-svg">
      <rect className="pa-line" x="30" y="22" width="140" height="104" rx="8" />
      <line className="pa-line" x1="30" y1="40" x2="170" y2="40" />
      {[42, 52, 62].map((x) => (
        <circle key={x} cx={x} cy="31" r="2.6" className="pa-dot" />
      ))}
      <rect x="50" y="98" width="100" height="8" rx="4" className="pa-track" />
      <rect x="50" y="98" width="100" height="8" rx="4" className="pa-fill" />
      <path className="pa-check" pathLength={1} d="M84 70l12 12 22-26" />
    </svg>
  );
}

const ART: { kicker: string; caption: string; Art: () => ReactNode }[] = [
  { kicker: 'i', caption: 'an idea', Art: Idea },
  { kicker: 'ii', caption: 'a sketch', Art: Sketch },
  { kicker: 'iii', caption: 'first lines', Art: Code },
  { kicker: 'iv', caption: 'piece by piece', Art: Blocks },
  { kicker: 'v', caption: 'the right tools', Art: Tools },
  { kicker: 'vi', caption: 'connecting things', Art: Network },
  { kicker: 'vii', caption: 'ready to ship', Art: Ship },
];

/** Page n (0-based, in the order pages are seen while turning). */
export function PageArt({ n }: { n: number }) {
  const { kicker, caption, Art } = ART[n % ART.length];
  return (
    <div className="page-art" aria-hidden="true">
      <div className="page-art__figure">
        <Art />
      </div>
      <p className="page-art__caption">
        <span>{kicker}</span>
        {caption}
      </p>
    </div>
  );
}
