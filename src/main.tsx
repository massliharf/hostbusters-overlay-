import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import App from './App.tsx';
import CasualWordle from './CasualWordle.tsx';
import './index.css';

function Router() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (hash === '#/savvy') {
    return <CasualWordle />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <Router />
);
