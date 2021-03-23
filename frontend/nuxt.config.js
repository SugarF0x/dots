import colors from 'vuetify/es5/util/colors'

/**
 * .env definitions in use
 *
 * BASE_URL - define base path to prepend to Axios calls [default: http://localhost:1337]
 * AUTH_DISCORD_URL - Discord auth URL used in OAuth2
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
    '@nuxtjs/axios',
    '@nuxtjs/auth'
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
        _scheme: 'oauth2',
        endpoints: {
          authorization: process.env.AUTH_URL_DISCORD || '/error?message=Discord%20URL%20missing&title=Auth%20disabled&',
          token: 'https://discord.com/api/oauth2/token',
          // userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
          logout: 'https://discord.com/api/oauth2/token/revoke'
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
