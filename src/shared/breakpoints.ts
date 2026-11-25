/**
 * The site is built phone-first: base styles are for phones, and larger layouts switch on at
 * these widths. Keep in step with the `@media (min-width: …)` queries in the CSS.
 */
export const WIDE_MIN = 820; // two-column layouts, side-by-side devices, dot progress rail
export const WIDE_QUERY = `(min-width: ${WIDE_MIN}px)`;

/** True from the wide layout up; phones and small tablets are the default. */
export const isWide = (vw: number = window.innerWidth) => vw >= WIDE_MIN;
