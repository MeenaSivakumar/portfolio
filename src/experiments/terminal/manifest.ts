import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'terminal',
  name: 'Developer terminal',
  group: 'A',
  description: 'A small shell visitors can type into: navigate chapters, list content, change theme.',
  defaultVariant: 'dock',
  variants: [
    { id: 'dock', label: 'Floating dock', slot: 'global', description: 'Launcher in the corner opens a window.' },
    { id: 'dropdown', label: 'Drop-down console', slot: 'global', description: 'Slides from the top; toggle with the ` key.' },
    { id: 'section', label: 'Inline chapter', slot: 'after-projects', description: 'A full-width console between Projects and Achievements.' },
  ],
  component: lazy(() => import('./Terminal')),
});
