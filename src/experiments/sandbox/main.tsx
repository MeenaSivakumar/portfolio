import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/tokens.css';
import '../../styles/base.css';
import { Sandbox } from './Sandbox';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sandbox />
  </StrictMode>,
);
