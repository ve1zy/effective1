import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { requestNotificationPermission } from './firebase';
import './index.css';

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[Service Worker] Registered:', registration);

      if (registration.installing) {
        console.log('[Service Worker] Installing...');
      } else if (registration.waiting) {
        console.log('[Service Worker] Waiting...');
      } else if (registration.active) {
        console.log('[Service Worker] Active');
      }
    } catch (error) {
      console.error('[Service Worker] Registration failed:', error);
    }
  });
}

requestNotificationPermission();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  </React.StrictMode>
);