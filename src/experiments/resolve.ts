import { allowUrlPreview, experimentsConfig } from './experiments.config';
import { EXPERIMENTS } from './registry';
import type { Selection } from './types';

export const FX_PARAM = 'fx';

function baseSelection(): Selection {
  const sel: Selection = {};
  for (const exp of EXPERIMENTS) {
    const cfg = experimentsConfig[exp.id];
    const variant = cfg?.variant && exp.variants.some((v) => v.id === cfg.variant) ? cfg.variant : exp.defaultVariant;
    sel[exp.id] = { enabled: Boolean(cfg?.enabled), variant };
  }
  return sel;
}

/** "terminal:dock,cursor:blend" → a selection with exactly those enabled. */
export function parseFxParam(raw: string): Selection {
  const sel = baseSelection();
  for (const id in sel) sel[id].enabled = false;
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [id, variant] = pair.split(':');
      const exp = EXPERIMENTS.find((e) => e.id === id);
      if (!exp) return;
      sel[id] = {
        enabled: true,
        variant: exp.variants.some((v) => v.id === variant) ? variant : exp.defaultVariant,
      };
    });
  return sel;
}

export function serializeSelection(sel: Selection): string {
  return Object.entries(sel)
    .filter(([, s]) => s.enabled)
    .map(([id, s]) => `${id}:${s.variant}`)
    .join(',');
}

export function resolveSelection(search = window.location.search): Selection {
  if (allowUrlPreview) {
    const params = new URLSearchParams(search);
    if (params.has(FX_PARAM)) return parseFxParam(params.get(FX_PARAM) ?? '');
  }
  return baseSelection();
}

export { baseSelection };
