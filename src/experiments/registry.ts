import type { ExperimentManifest } from './types';

/**
 * Auto-discovers every experiment folder that contains a manifest.ts.
 * Deleting a folder removes the experiment — nothing else needs to change.
 */
const modules = import.meta.glob<{ default: ExperimentManifest }>('./*/manifest.ts', { eager: true });

const groupOrder = 'ABCDE';

export const EXPERIMENTS: ExperimentManifest[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || a.name.localeCompare(b.name));

export const experimentById = (id: string) => EXPERIMENTS.find((e) => e.id === id);
