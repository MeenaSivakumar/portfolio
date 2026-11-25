import { useEffect, useMemo, useState } from 'react';
import { EXPERIMENTS } from '../experiments/registry';
import { baseSelection, FX_PARAM, serializeSelection } from '../experiments/resolve';
import { GROUP_LABELS, type ExperimentGroup, type Selection } from '../experiments/types';
import { readStore, writeStore } from '../shared/safeStorage';
import { SLOT_NAMES } from '../shared/slots';

/**
 * Experiment Lab — separate page, never shipped to visitors unless built with LAB=1.
 * Left: every experiment with its own toggle and variant switch.
 * Right: the real portfolio with your combination applied (via ?fx=), or a single
 * experiment alone on the neutral sandbox.
 */

const STORE = 'lab:selection:v1';
const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', width: '100%' },
  { id: 'tablet', label: 'Tablet', width: '820px' },
  { id: 'mobile', label: 'Mobile', width: '390px' },
] as const;

type Mode = 'combined' | 'isolated';

function loadSelection(): Selection {
  const base = baseSelection();
  const saved = readStore<Selection>(STORE, {});
  for (const id in base) {
    const s = saved[id];
    const exp = EXPERIMENTS.find((e) => e.id === id)!;
    if (s && exp.variants.some((v) => v.id === s.variant)) base[id] = { enabled: !!s.enabled, variant: s.variant };
  }
  return base;
}

export function Lab() {
  const [sel, setSel] = useState<Selection>(loadSelection);
  const [mode, setMode] = useState<Mode>('combined');
  const [solo, setSolo] = useState<string>(EXPERIMENTS[0]?.id ?? '');
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]['id']>('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => writeStore(STORE, sel), [sel]);

  const fx = serializeSelection(sel);
  const soloExp = EXPERIMENTS.find((e) => e.id === solo);
  const src =
    mode === 'combined'
      ? `/index.html?${FX_PARAM}=${encodeURIComponent(fx)}`
      : `/sandbox.html?${FX_PARAM}=${encodeURIComponent(soloExp ? `${solo}:${sel[solo].variant}` : '')}`;

  const groups = useMemo(() => {
    const map = new Map<ExperimentGroup, typeof EXPERIMENTS>();
    EXPERIMENTS.forEach((e) => map.set(e.group, [...(map.get(e.group) ?? []), e]));
    return [...map.entries()];
  }, []);

  const update = (id: string, patch: Partial<Selection[string]>) => setSel((s) => ({ ...s, [id]: { ...s[id], ...patch } }));
  const setAll = (enabled: boolean) =>
    setSel((s) => Object.fromEntries(Object.entries(s).map(([id, v]) => [id, { ...v, enabled }])) as Selection);

  const enabledCount = Object.values(sel).filter((s) => s.enabled).length;

  const exportCode = `// src/experiments/experiments.config.ts
export const experimentsConfig: Record<string, ExperimentSetting> = {
${EXPERIMENTS.map((e) => `  '${e.id}': { enabled: ${sel[e.id].enabled}, variant: '${sel[e.id].variant}' },`).join('\n')}
};`;

  return (
    <div className="lab">
      <aside className="lab__side">
        <header className="lab__brand">
          <strong>Experiment Lab</strong>
          <span>
            {enabledCount} of {EXPERIMENTS.length} on
          </span>
        </header>

        <div className="lab__bulk">
          <button type="button" onClick={() => setAll(false)}>
            All off
          </button>
          <button type="button" onClick={() => setAll(true)}>
            All on
          </button>
          <button type="button" onClick={() => setSel(baseSelection())}>
            Reset to config
          </button>
        </div>

        {groups.map(([g, exps]) => (
          <section key={g} className="lab__group">
            <h2>
              <span>{g}</span> {GROUP_LABELS[g]}
            </h2>
            {exps.map((e) => {
              const s = sel[e.id];
              const v = e.variants.find((x) => x.id === s.variant)!;
              return (
                <div key={e.id} className="lab__exp" data-on={s.enabled} data-solo={mode === 'isolated' && solo === e.id}>
                  <div className="lab__exp-top">
                    <label className="lab__switch">
                      <input type="checkbox" checked={s.enabled} onChange={(ev) => update(e.id, { enabled: ev.target.checked })} />
                      <span aria-hidden="true" />
                      <b>{e.name}</b>
                    </label>
                    <button
                      type="button"
                      className="lab__solo"
                      onClick={() => {
                        setSolo(e.id);
                        setMode('isolated');
                      }}
                      title="Preview this experiment alone"
                    >
                      Solo
                    </button>
                  </div>
                  <p className="lab__desc">{e.description}</p>
                  <div className="lab__variants" role="radiogroup" aria-label={`${e.name} variant`}>
                    {e.variants.map((x) => (
                      <button key={x.id} type="button" role="radio" aria-checked={x.id === s.variant} onClick={() => update(e.id, { variant: x.id })}>
                        {x.label}
                      </button>
                    ))}
                  </div>
                  <p className="lab__meta">
                    {v.description && <span>{v.description} </span>}
                    <code>slot: {v.slot}</code>
                  </p>
                </div>
              );
            })}
          </section>
        ))}

        <footer className="lab__foot">
          Slots: {SLOT_NAMES.join(' · ')}
          <br />
          Add an experiment: create <code>src/experiments/&lt;id&gt;/manifest.ts</code>. Remove one: delete its folder.
        </footer>
      </aside>

      <div className="lab__main">
        <div className="lab__bar">
          <div className="lab__tabs" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'combined'} onClick={() => setMode('combined')}>
              Combined preview
            </button>
            <button type="button" role="tab" aria-selected={mode === 'isolated'} onClick={() => setMode('isolated')}>
              Isolated{soloExp ? `: ${soloExp.name}` : ''}
            </button>
          </div>
          <div className="lab__tabs">
            {VIEWPORTS.map((vp) => (
              <button key={vp.id} type="button" aria-pressed={viewport === vp.id} onClick={() => setViewport(vp.id)}>
                {vp.label}
              </button>
            ))}
          </div>
          <div className="lab__actions">
            <button type="button" onClick={() => setReloadKey((k) => k + 1)}>
              Reload
            </button>
            <a href={src} target="_blank" rel="noreferrer">
              Open ↗
            </a>
            <button type="button" onClick={() => setExportOpen((o) => !o)} aria-expanded={exportOpen}>
              Export config
            </button>
          </div>
        </div>

        {exportOpen && (
          <div className="lab__export">
            <p>Paste into <code>src/experiments/experiments.config.ts</code> to ship this combination to visitors.</p>
            <pre>
              <code>{exportCode}</code>
            </pre>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(exportCode).then(
                  () => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1400);
                  },
                  () => undefined,
                )
              }
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        <div className="lab__frame-wrap">
          <iframe
            key={`${src}|${reloadKey}`}
            title={mode === 'combined' ? 'Portfolio preview with selected experiments' : 'Isolated experiment preview'}
            src={src}
            className="lab__frame"
            style={{ width: VIEWPORTS.find((v) => v.id === viewport)!.width }}
          />
        </div>
        <div className="lab__url">
          <code>{src}</code>
        </div>
      </div>
    </div>
  );
}
