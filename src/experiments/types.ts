import type { ComponentType } from 'react';
import type { SlotName } from '../shared/slots';

export interface VariantProps {
  variant: string;
}

export interface ExperimentVariant {
  id: string;
  label: string;
  description?: string;
  /** Where this variant mounts. Variants of one experiment may live in different slots. */
  slot: SlotName;
}

export type ExperimentGroup = 'A' | 'B' | 'C' | 'D' | 'E';

export const GROUP_LABELS: Record<ExperimentGroup, string> = {
  A: 'Interactive developer terminal',
  B: 'Technology universe',
  C: 'Live project playground',
  D: 'Microinteractions',
  E: 'Chapter progress indicator',
};

export interface ExperimentManifest {
  /** Unique id; also the folder name and the config key */
  id: string;
  name: string;
  group: ExperimentGroup;
  description: string;
  variants: ExperimentVariant[];
  defaultVariant: string;
  /** Usually React.lazy(() => import('./X')) so disabled experiments cost nothing */
  component: ComponentType<VariantProps>;
}

export interface ExperimentSetting {
  enabled: boolean;
  variant?: string;
}

export type Selection = Record<string, { enabled: boolean; variant: string }>;

export const defineExperiment = (m: ExperimentManifest) => m;
