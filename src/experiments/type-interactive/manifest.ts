import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'type-interactive',
  name: 'Interactive typography',
  group: 'D',
  description: 'Headings marked data-fx-heading respond to the pointer.',
  defaultVariant: 'letter-lift',
  variants: [
    { id: 'letter-lift', label: 'Letter lift', slot: 'global', description: 'Letters near the pointer rise.' },
    { id: 'scramble', label: 'Scramble', slot: 'global', description: 'Text decodes on hover.' },
    { id: 'proximity', label: 'Proximity weight', slot: 'global', description: 'Letters swell and darken by distance.' },
  ],
  component: lazy(() => import('./TypeInteractive')),
});
