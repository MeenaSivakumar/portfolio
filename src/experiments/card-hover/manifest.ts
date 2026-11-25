import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'card-hover',
  name: 'Card hover',
  group: 'D',
  description: 'Hover treatments for elements marked data-fx-card (project cards, milestones, articles).',
  defaultVariant: 'spotlight',
  variants: [
    { id: 'spotlight', label: 'Spotlight border', slot: 'global', description: 'A light that tracks the pointer along the edge.' },
    { id: 'tilt', label: '3D tilt + glare', slot: 'global' },
    { id: 'lift', label: 'Lift', slot: 'global' },
  ],
  component: lazy(() => import('./CardHover')),
});
