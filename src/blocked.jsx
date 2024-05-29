import React from 'react'
import ReactDOM from 'react-dom';
import BlockedPage from './BlockedPage';
import './index.css';

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BlockedPage />
  </React.StrictMode>
);
