import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Importăm componenta ta principală

// Aici luăm div-ul gol din pagina de HTML și "desenăm" aplicația NeuroDeck în el
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);