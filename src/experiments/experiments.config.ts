import type { ExperimentSetting } from './types';

/**
 * What VISITORS get. Every experiment ships disabled so the core portfolio is
 * untouched until you decide to keep something. Use the lab (/lab.html) to try
 * combinations, then paste its exported config here.
 *
 * Keys that don't match an existing experiment folder are ignored, and folders
 * without a key here default to disabled — so adding/removing experiments never
 * requires editing this file.
 */
export const experimentsConfig: Record<string, ExperimentSetting> = {
  terminal: { enabled: true, variant: 'dock' },
  'tech-universe': { enabled: false, variant: 'orbit' },
  playground: { enabled: false, variant: 'workbench' },
  cursor: { enabled: false, variant: 'dot-ring' },
  magnetic: { enabled: false, variant: 'subtle' },
  'card-hover': { enabled: false, variant: 'spotlight' },
  'type-interactive': { enabled: false, variant: 'letter-lift' },
  'scroll-text': { enabled: false, variant: 'word-rise' },
  'subtle-motion': { enabled: false, variant: 'parallax' },
  'page-transition': { enabled: false, variant: 'wipe' },
  'nav-feedback': { enabled: false, variant: 'pill' },
  progress: { enabled: true, variant: 'rail' },
};

/**
 * When true, `?fx=id:variant,id:variant` in the URL replaces the config above for
 * that page load. The lab uses this for its combined preview. Set to false to
 * lock production to the config only.
 */
export const allowUrlPreview = true;
