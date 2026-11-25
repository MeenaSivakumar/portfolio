import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'playground',
  name: 'Live playground',
  group: 'C',
  description: 'Small frontend components visitors can tweak live. Independent from the project showcase.',
  defaultVariant: 'workbench',
  variants: [
    { id: 'workbench', label: 'Workbench', slot: 'after-projects', description: 'Component list · live stage · prop knobs · generated code.' },
    { id: 'css-lab', label: 'CSS lab', slot: 'after-projects', description: 'Edit a component’s CSS and watch it update.' },
    { id: 'drawer', label: 'Side drawer', slot: 'global', description: 'A launcher that slides the workbench in from the side.' },
  ],
  component: lazy(() => import('./Playground')),
});
