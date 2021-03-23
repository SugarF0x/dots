import colors from 'vuetify/es5/util/colors'

/**
 * .env definitions in use
 *
 * BASE_URL - define base path to prepend to Axios calls [default: http://localhost:1337]
 * PASSWORD - pass to get editor access [default: 1234]
 * SECRET - JWT secret [default: 4321]
 */

export default {
  ssr: false,
  target: 'server',
  head: {
    titleTemplate: 'DotS',
    title: 'DotS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'База данных тупорезок хоти' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  css: [
    '~/assets/global'
  ],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios'
  ],
  plugins: [],
  axios: {
    baseURL: process.env.NODE_ENV === 'development' || !process.env.BASE_URL
      ? `http://${process.env.HOST || 'localhost'}:1337`
      : process.env.BASE_URL
  },
  vuetify: {
    treeShake: {
      loaderOptions: {
        progressiveImages: {
          size: 16,
          sharp: true,
          resourceQuery: /preload/
        }
      }
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  build: {}
}
