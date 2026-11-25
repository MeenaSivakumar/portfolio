import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import { App } from './core/App';
import { SlotProvider } from './core/Slot';

// ── Experiments ──────────────────────────────────────────────────────────────
// The only place experiments touch the portfolio. Delete these two lines (and
// the `value` prop below) to remove the whole experiment system.
import { createSlotRenderer } from './experiments/host';
const renderSlot = createSlotRenderer();
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SlotProvider value={renderSlot}>
      <App />
    </SlotProvider>
  </StrictMode>,
);
