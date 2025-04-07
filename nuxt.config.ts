// https://nuxt.com/docs/api/configuration/nuxt-config
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
      // Add the fonts you want to use
      Inter: [400, 500, 700],  // Regular, Medium, Bold
      Poppins: [400, 600, 700],
      // You can add more fonts here
    },
    display: 'swap', // This improves page load speed
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false // Set to true if you want to download fonts instead of using CDN
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
  }
})
