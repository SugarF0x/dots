import colors from 'vuetify/es5/util/colors'

/**
 * .env definitions in use
 *
 * BASE_URL - define base path to prepend to Axios calls [default: http://localhost:3000/api]
 * PASSWORD - pass to get editor access [default: 1234]
 * SECRET - JWT secret [default: 4321]
 */

export default {
  ssr: false,
  target: 'static',
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
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  axios: {
    baseURL: process.env.NODE_ENV === 'development' || !process.env.BASE_URL
      ? `http://localhost:3000/api`
      : process.env.BASE_URL
  },
  auth: {
    cookie: {
      options: {
        expires: 365
      }
    },
    resetOnError: true,
    redirect: {
      login: '/login',
      logout: false
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/auth/me',
            method: 'GET',
            propertyName: 'token'
          }
        },
        tokenRequired: true
      },
    },
  },
  vuetify: {
    treeShake: {
      loaderOptions: {
        progressiveImages: {
          sharp: true
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
  build: {

  },
  serverMiddleware: {
    '/api': '~/api'
  }
}
