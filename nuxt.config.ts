// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/supabase', '@nuxtjs/google-fonts', '@vite-pwa/nuxt'],
  css: [
    "~/assets/css/global.css",
    'font-awesome/css/font-awesome.min.css',
    "swiper/css", 
    "swiper/css/navigation", 
    "swiper/css/pagination"
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 700],
      Poppins: [400, 600, 700],
      // You can add more fonts here
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false
  },
  build: {
    transpile: ["font-awesome"]
  },
  supabase:{
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions:{
      login: '/Login',
      callback : '/Confirm',
      exclude: ['/*'],
    },
  },
  runtimeConfig:{
    public:{
      supabase:{
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
      }
    }
  },
  ssr: true,
  nitro: {
    preset: 'static'
  },
  pwa: {
    manifest: {
      name: 'KKK Cooperative',
      short_name: 'KKK',
      description: 'Your Trusted Cooperative Bank for Savings, Loans and easy Transactions.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icons/icon-16.png',
          sizes: '16x16',
          type: 'image/png'
        },
        {
          src: '/icons/icon-32.png',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    registerType: 'autoUpdate',
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === self.location.origin,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-resources',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
