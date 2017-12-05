module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'advise',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: 'components/Loading.vue',
  router: {
    linkExactActiveClass: 'exact-active-link',
  },
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
