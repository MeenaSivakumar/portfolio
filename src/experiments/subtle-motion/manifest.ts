import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'subtle-motion',
  name: 'Subtle element movement',
  group: 'D',
  description: 'Small ambient movement for elements marked data-fx-float.',
  defaultVariant: 'parallax',
  variants: [
    { id: 'parallax', label: 'Scroll parallax', slot: 'global', description: 'Elements drift at a slightly different speed to the page.' },
    { id: 'breathe', label: 'Idle float', slot: 'global', description: 'A slow, staggered bob.' },
    { id: 'pointer', label: 'Pointer drift', slot: 'global', description: 'Elements shift gently away from the pointer.' },
  ],
  component: lazy(() => import('./SubtleMotion')),
});
