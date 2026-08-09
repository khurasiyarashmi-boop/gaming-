import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle unhandled promise rejections and errors cleanly (e.g. benign Vite HMR websocket disconnects or cancelled share dialogs)
if (typeof window !== 'undefined') {
  const isViteOrWsError = (err: any) => {
    if (!err) return false;
    let str = '';
    try {
      if (typeof err === 'string') str = err;
      else if (err.message) str = err.message;
      else if (err.reason) str = typeof err.reason === 'string' ? err.reason : (err.reason && err.reason.message) || String(err.reason);
      else str = String(err);
    } catch {
      str = String(err);
    }
    const lower = str.toLowerCase();
    return (
      lower.includes('websocket') ||
      lower.includes('vite') ||
      lower.includes('hmr') ||
      lower.includes('closed without opened') ||
      lower.includes('failed to connect') ||
      err.name === 'AbortError'
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isViteOrWsError(event.reason) || isViteOrWsError(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (
        isViteOrWsError(event.error) ||
        isViteOrWsError(event.message) ||
        (event.target && (event.target as any).tagName === 'SCRIPT' && String((event.target as any).src).includes('@vite'))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);


