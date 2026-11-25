import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'tech-universe',
  name: 'Technology universe',
  group: 'B',
  description: 'An explorable map of technology groups and the relationships between them.',
  defaultVariant: 'orbit',
  variants: [
    { id: 'orbit', label: 'Orbits', slot: 'after-journey', description: 'Groups as orbital rings around a core; hover a node to trace its links.' },
    { id: 'graph', label: 'Force graph', slot: 'after-journey', description: 'Draggable physics graph; clusters form around group hubs.' },
    { id: 'clusters', label: 'Clusters', slot: 'after-journey', description: 'Group bubbles that expand into their technologies.' },
  ],
  component: lazy(() => import('./TechUniverse')),
});
