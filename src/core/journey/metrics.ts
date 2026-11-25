import { isWide } from '../../shared/breakpoints';

/** All geometry for the storytelling objects, derived from the viewport. */
export interface Metrics {
  vw: number;
  vh: number;
  narrow: boolean;
  pageW: number;
  pageH: number;
  phoneW: number;
  phoneH: number;
  phoneR: number;
  phoneBezel: number;
  laptopW: number;
  laptopH: number;
  laptopR: number;
  laptopBezel: number;
  phoneX: number;
  laptopX: number;
  deviceY: number;
  bookZoom: number;
}

export function computeMetrics(vw: number, vh: number): Metrics {
  const narrow = !isWide(vw);
  // On phones leave room for the camera zoom so the open book stays inside the side margins.
  const sideRoom = narrow ? 52 : 32;
  // Phone pages are width-limited, so they get a taller (paperback) shape to hold the intro.
  const ratio = narrow ? 0.55 : 0.72;
  const pageH = Math.min(vh * (narrow ? 0.56 : 0.66), 600, ((vw - sideRoom) / 2) / ratio);
  const pageW = pageH * ratio;
  const phoneH = narrow ? Math.min(vh * 0.44, 500) : Math.min(vh * 0.74, 660);
  const phoneW = phoneH * 0.49;
  const laptopW = narrow ? Math.min(vw - 56, 560) : Math.min(vw * 0.46, 860, (vh * 0.62) / 0.66);
  const laptopH = laptopW * 0.625;
  return {
    vw,
    vh,
    narrow,
    pageW,
    pageH,
    phoneW,
    phoneH,
    phoneR: phoneW * 0.17,
    phoneBezel: Math.max(7, phoneW * 0.04),
    laptopW,
    laptopH,
    laptopR: Math.max(10, laptopW * 0.018),
    laptopBezel: Math.max(8, laptopW * 0.016),
    phoneX: narrow ? 0 : -vw * 0.2,
    laptopX: narrow ? 0 : vw * 0.2,
    deviceY: narrow ? -vh * 0.17 : 0,
    bookZoom: narrow ? 1.06 : 1.1,
  };
}
