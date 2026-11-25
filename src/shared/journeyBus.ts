import { useSyncExternalStore } from 'react';
import type { ChapterId } from './chapters';

/**
 * A tiny read-only broadcast of where the visitor is in the journey.
 * The core publishes; experiments subscribe. Experiments must never write to it.
 */
export interface JourneyState {
  chapter: ChapterId;
  chapterIndex: number;
  /** 0..1 progress through the current chapter */
  chapterProgress: number;
  /** 0..1 progress through the whole page */
  overall: number;
  /** True once the intro has handed over to the navigation header */
  headerVisible: boolean;
}

let state: JourneyState = {
  chapter: 'intro',
  chapterIndex: 0,
  chapterProgress: 0,
  overall: 0,
  headerVisible: false,
};

const listeners = new Set<() => void>();

export const journeyBus = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  /** @internal — only the core (or the sandbox simulator) should publish. */
  publish(patch: Partial<JourneyState>) {
    let changed = false;
    for (const k in patch) {
      const key = k as keyof JourneyState;
      if (patch[key] !== state[key]) changed = true;
    }
    if (!changed) return;
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
};

export function useJourney<T = JourneyState>(select?: (s: JourneyState) => T): T {
  return useSyncExternalStore(
    journeyBus.subscribe,
    () => (select ? select(journeyBus.get()) : (journeyBus.get() as unknown as T)),
    () => (select ? select(journeyBus.get()) : (journeyBus.get() as unknown as T)),
  );
}
