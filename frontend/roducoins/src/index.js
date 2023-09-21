import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
const appRoot = createRoot(root);

appRoot.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);