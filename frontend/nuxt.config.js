import colors from 'vuetify/es5/util/colors'

/**
 * .env definitions in use
 *
 * BASE_URL - define base path to prepend to Axios calls [default: http://localhost:3000]
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
      { hid: 'description', name: 'description', content: 'База данных тупорезок хоти' },
      { hid: 'og:title', name: 'og:title', content: 'База данных тупорезок хоти' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:url', name: 'og:type', content: process.env.BASE_URL || `http://localhost:3000` },
      { hid: 'og:image', name: 'og:image', content: `${process.env.BASE_URL || `http://localhost:3000`}/card.jpg` },
      { hid: 'og:image:width', name: 'og:image:width', content: '1600' },
      { hid: 'og:image:height', name: 'og:image:height', content: '800' }
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
    '@nuxtjs/auth-next'
  ],
  plugins: [],
  axios: {
    baseURL: process.env.NODE_ENV === 'development' || !process.env.BASE_URL
      ? `http://localhost:1337`
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
      discord: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.BASE_URL
            ?  process.env.BASE_URL+ '/connect/discord'
            : 'http://localhost:1337/connect/discord',
          token: 'https://discord.com/api/oauth2/token',
          userInfo: process.env.BASE_URL
            ? process.env.BASE_URL+ '/users/me'
            : 'http://localhost:1337/users/me'
        },
        token: {
          property: 'jwt',
          type: 'Bearer',
          maxAge: 365 * 24 * 60 * 60
        },
        responseType: 'token',
        redirectUri: `${process.env.BASE_URL || 'http://localhost:1337'}/connect/discord/callback`,
        logoutRedirectUri: '/',
        clientId: '823885094250479666',
        scope: ['identify']
      },
    }
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
