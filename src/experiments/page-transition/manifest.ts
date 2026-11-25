import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'page-transition',
  name: 'Page transitions',
  group: 'D',
  description: 'Covers long chapter jumps from links marked data-fx-link with a short transition instead of a long smooth scroll.',
  defaultVariant: 'wipe',
  variants: [
    { id: 'wipe', label: 'Wipe', slot: 'global' },
    { id: 'fade', label: 'Fade', slot: 'global' },
    { id: 'chapter-card', label: 'Chapter card', slot: 'global', description: 'Shows the destination chapter number and title.' },
  ],
  component: lazy(() => import('./PageTransition')),
});
