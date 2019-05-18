const modulePath = require('../../src/module')
import { Context } from '@@/@types/nuxt-types/index';
const pages = require('./lang/pages')

import appRoutes from './lang/appRoutes'

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
      seo: {
        htmlLang: true,
        generateAlternate: true,
        generateOg: true,
        generateCanoncial: true,
      },
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
            posts: 'Clanky',
            back: 'zpet'
          },
          en: {
            home: 'Homepage',
            about: 'About us',
            posts: 'Posts',
            back: 'back'
          }
        },
        fallbackLocale: 'en'
      },
      pages,
      sitemap: {
        source: appRoutes
      }
      // sitemap: {
      //   source: 'directus-7',
      //   url: 'https://api.elisiondesign.cz/', // <-- is public and read-only, no bearer token required
      //   project: 'elision',
      //   mappings: [
      //     {
      //       nuxtPage: 'blog', // app page, relates to first level nuxt page
      //       dynamicRoute: '_title', // the dynamic part (as defined in pages.js
      //       table: 'blog', // table name in directus
      //       field: 'slug' // Translated field to be included in the sitemap
      //     },
      //     {
      //       nuxtPage: 'projects', // app page, relates to first level nuxt page
      //       dynamicRoute: '_name', // the dynamic part (as defined in pages.js
      //       table: 'projects', // table name in directus
      //       field: 'url', // Translated field to be included in the sitemap
      //       outer: true
      //     }
      //   ]
      // }
    }],
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
