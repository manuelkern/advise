module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Advise',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Geneva law firm' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }
    ]
  },
  /*
  ** Custom loader
  */
  loading: 'components/Loading.vue',
  /*
  ** Build configuration
  */
  css: [
    { src: '~assets/css/main.scss', lang: 'scss' } // scss instead of sass
  ],
  plugins: [
    { src: '~/plugins/vue-scrollactive' },
    { src: '~/plugins/vue-googlemaps' }
  ],
  modules: [
    '@nuxtjs/dotenv'
  ],
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ x: 0, y: 0 })
        }, 500)
      })
    }
  },
  build: {
    vendor: ['axios','gsap'],
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
