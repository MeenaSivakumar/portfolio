import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'cursor',
  name: 'Custom cursor',
  group: 'D',
  description: 'Pointer replacement for fine-pointer devices. Touch devices are untouched.',
  defaultVariant: 'dot-ring',
  variants: [
    { id: 'dot-ring', label: 'Dot + ring', slot: 'global', description: 'A dot with a trailing ring that grows over interactive elements.' },
    { id: 'blend', label: 'Difference blend', slot: 'global', description: 'A large disc that inverts what it passes over.' },
    { id: 'spotlight', label: 'Spotlight', slot: 'global', description: 'A soft light follows the pointer; native cursor kept.' },
    { id: 'trail', label: 'Ink trail', slot: 'global', description: 'A fading trail behind the native cursor.' },
  ],
  component: lazy(() => import('./Cursor')),
});
