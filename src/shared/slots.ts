/**
 * Named integration points the core layout exposes. The core renders <Slot name>;
 * whatever is plugged into a slot (experiments today, anything tomorrow) is decided
 * by the composition root (src/main.tsx). The core never imports experiments.
 *
 *  global          fixed overlays & document-level effects (cursor, progress, terminal dock…)
 *  after-journey   a full section between the Web chapter and Projects
 *  after-projects  a full section between Projects and Achievements
 *  before-finale   a full section between Articles and About
 */
export type SlotName = 'global' | 'after-journey' | 'after-projects' | 'before-finale';

export const SLOT_NAMES: SlotName[] = ['global', 'after-journey', 'after-projects', 'before-finale'];
