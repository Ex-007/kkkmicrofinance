export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/supabase', '@nuxtjs/google-fonts'],
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
      Tagesschrift: [400, 600, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false
  },
  head: {
    link: [
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'apple-touch-icon', href: '/icons/icon-192.png' }
    ],
    meta: [
      { name: 'theme-color', content: '#ffffff' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ]
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
    sendchampKey: process.env.SENDCHAMP_KEY,
    resendKey: process.env.RESEND_KEY,
    public:{
      supabase:{
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY
      }
    },
  },
  ssr: true,
  nitro: {
    preset: 'vercel-edge'
  },
  
})
