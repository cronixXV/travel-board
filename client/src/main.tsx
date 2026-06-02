import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './app/index.css';
import { applyTheme, getTheme } from './shared/lib/theme';

applyTheme(getTheme());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
