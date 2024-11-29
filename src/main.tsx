import { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';

import App from './App.tsx'

import '@mantine/core/styles.css';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
        <MantineProvider>
          <App />
        </MantineProvider>
    </Router>
  </StrictMode>,
)
