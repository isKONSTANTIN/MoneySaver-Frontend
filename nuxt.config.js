export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MoneySaver',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/assets/css/main.pcss',
    { src: '~/plugins/chartjs.js', mode: 'client' },
    { src: '~/plugins/qr.js',  mode: 'client' },
    { src: "~/plugins/composition.js" },
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/pwa'
  ],

  pwa: {
    manifest: {
      lang: 'ru',
      name: "MoneySaver",
      short_name: "MoneySaver",
      display: 'fullscreen',
      gcm_sender_id: "103953800507"
    },
    workbox: {
      dev: false
    }
  },

  workbox: {
    importScripts: [
      'custom-sw.js'
    ],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt'
  ],

  axios: {
    proxy: true,
    prefix: '/api'
  },

  proxy: {
    '/api/': { target: process.env.NODE_ENV === 'production' ? "http://backend:8080/" : "http://localhost:8080/", pathRewrite: { '^/api/': '/api/' } }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
