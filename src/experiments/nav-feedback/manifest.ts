import { lazy } from 'react';
import { defineExperiment } from '../types';

export default defineExperiment({
  id: 'nav-feedback',
  name: 'Navigation feedback',
  group: 'D',
  description: 'An indicator that glides between nav links (data-fx-nav) following hover and the active chapter.',
  defaultVariant: 'pill',
  variants: [
    { id: 'pill', label: 'Sliding pill', slot: 'global' },
    { id: 'underline', label: 'Sliding underline', slot: 'global' },
    { id: 'bracket', label: 'Brackets', slot: 'global' },
  ],
  component: lazy(() => import('./NavFeedback')),
});
