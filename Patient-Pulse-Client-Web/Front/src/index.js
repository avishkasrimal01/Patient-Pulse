import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/main.scss';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create the root using React 18's createRoot method
const root = createRoot(rootElement);

// Render the App inside the root, no need to pass the container again
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Measuring performance if needed
reportWebVitals();
