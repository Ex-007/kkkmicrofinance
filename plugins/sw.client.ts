// plugins/sw.client.ts
export default defineNuxtPlugin(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(reg => console.log('✅ Service Worker registered:', reg))
          .catch(err => console.error('❌ Service Worker failed:', err));
      });
    }
  });
  