import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'scroll-text',
  name: 'Scroll text reveals',
  group: 'D',
  description: 'Section titles marked data-fx-reveal animate as they enter the viewport.',
  defaultVariant: 'word-rise',
  variants: [
    { id: 'word-rise', label: 'Word rise', slot: 'global', description: 'Words rise out of a mask, staggered.' },
    { id: 'blur-in', label: 'Blur in', slot: 'global', description: 'Letter-spaced blur resolves into place.' },
    { id: 'scrub', label: 'Scrubbed fill', slot: 'global', description: 'Words light up as you scroll through them.' },
  ],
  component: lazy(() => import('./ScrollText')),
});
