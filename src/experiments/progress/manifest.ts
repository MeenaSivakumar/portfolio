import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'progress',
  name: 'Chapter progress',
  group: 'E',
  description: 'Shows where the visitor is in the journey. Read-only: listens to the journey bus, never drives it.',
  defaultVariant: 'rail',
  variants: [
    { id: 'rail', label: 'Side rail', slot: 'global', description: 'Vertical chapter dots with a filling line.' },
    { id: 'ring', label: 'Corner ring', slot: 'global', description: 'Circular progress with chapter name; opens a chapter menu.' },
    { id: 'objects', label: 'Object strip', slot: 'global', description: 'Book → phone → laptop → pages, highlighting the current object.' },
    { id: 'topbar', label: 'Segmented bar', slot: 'global', description: 'One segment per chapter along the top edge.' },
  ],
  component: lazy(() => import('./Progress')),
});
