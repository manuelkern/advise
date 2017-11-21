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
  loading: { color: '#3B8070' },
  router: {
    linkExactActiveClass: 'exact-active-link',
  },
  /*
  ** Build configuration
  */
  css: [
    { src: '~assets/css/main.scss', lang: 'scss' } // scss instead of sass
  ],
  plugins: ['~/plugins/vue-smooth-scroll'],
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
  },
  /*
  ** env configuration
  */
  env: {
    cockpit: {
      apiUrl: 'http://advise.api:8888/api',
      apiToken: 'ca23a210b0e7fd2cf9df18cd3c6e7e',
      baseUrl: 'http://advise.api:8888'
    }
  }
}
