const modulePath = require('../../src/module')
import { Context } from '@@/@types/nuxt-types/index';
const pages = require('./lang/pages')

export default {
  env: {},
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [
    '@nuxtjs/axios',
    [modulePath, {
      seo: true,
      baseUrl: 'nuxt-app.localhost',
      locales: [
        {
          code: 'en',
          iso: 'en-US',
          name: 'English'
        },
        {
          code: 'cs',
          iso: 'CS',
          name: 'Czech'
        }
      ],
      defaultLocale: 'en',
      lazy: false,
      vueI18n: {
        messages: {
          cs: {
            home: 'Hlavni',
            about: 'O nas',
            posts: 'Clanky'
          },
          en: {
            home: 'Homepage',
            about: 'About us',
            posts: 'Posts'
          }
        },
        fallbackLocale: 'en'
      },
      pages,
      sitemap: {
        path: '/sitemap.xml',
        gzip: true,
        generate: false,
        cacheTime: 1000 * 60 * 60 * 24,
      }
    },
  '@nuxtjs/sitemap']
  ],
  axios: {},
  plugins: [
    '~/plugins/i18n-test',
    '~/plugins/myplugin'
  ],
  extend(config: any, ctx: Context) {
    if (ctx.isDev) {
      config.devtool = 'eval-source-map'
    }
    config.devtool = 'eval'
    // config.devtool = ctx.isDev ? 'eval-source-map' : 'inline-source-map'
  }
}
