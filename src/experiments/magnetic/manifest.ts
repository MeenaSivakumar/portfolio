import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'magnetic',
  name: 'Magnetic buttons',
  group: 'D',
  description: 'Buttons marked data-fx-magnetic lean toward the pointer.',
  defaultVariant: 'subtle',
  variants: [
    { id: 'subtle', label: 'Subtle', slot: 'global' },
    { id: 'strong', label: 'Strong + label parallax', slot: 'global' },
  ],
  component: lazy(() => import('./Magnetic')),
});
