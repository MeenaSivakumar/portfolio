import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Three separate HTML entries:
 *  - index.html    → the visitor-facing portfolio (core journey + enabled experiments)
 *  - lab.html      → experiment control room (toggles, variants, combined preview)
 *  - sandbox.html  → isolated stage that renders a single experiment on neutral content
 *
 * The lab and sandbox are only included in production builds when LAB=1,
 * so visitors never receive experiment tooling.
 */
const includeLab = process.env.LAB === '1';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...(includeLab
          ? {
              lab: resolve(__dirname, 'lab.html'),
              sandbox: resolve(__dirname, 'sandbox.html'),
            }
          : {}),
      },
    },
  },
});
