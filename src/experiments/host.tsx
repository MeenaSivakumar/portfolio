import { Component, Suspense, type ReactNode } from 'react';
import type { SlotName } from '../shared/slots';
import { EXPERIMENTS } from './registry';
import { resolveSelection } from './resolve';
import type { ExperimentManifest, Selection } from './types';

/** A crashing experiment renders nothing instead of taking the portfolio down with it. */
class ExperimentBoundary extends Component<{ id: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn(`[experiment:${this.props.id}] disabled after an error`, error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function renderExperiment(exp: ExperimentManifest, variant: string) {
  const Comp = exp.component;
  return (
    <ExperimentBoundary key={`${exp.id}:${variant}`} id={exp.id}>
      <Suspense fallback={null}>
        <Comp variant={variant} />
      </Suspense>
    </ExperimentBoundary>
  );
}

/** Builds the function the core's <Slot> calls. */
export function createSlotRenderer(selection: Selection = resolveSelection()) {
  return (slot: SlotName): ReactNode => {
    const nodes = EXPERIMENTS.filter((exp) => {
      const s = selection[exp.id];
      if (!s?.enabled) return false;
      return exp.variants.find((v) => v.id === s.variant)?.slot === slot;
    }).map((exp) => renderExperiment(exp, selection[exp.id].variant));
    return nodes.length ? nodes : null;
  };
}
