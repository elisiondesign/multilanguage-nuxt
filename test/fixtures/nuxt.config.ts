const modulePath = require('../../src/module');

export default {
  env: {},
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [
    "@nuxtjs/axios",
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
          code: 'fr',
          iso: 'fr-FR',
          name: 'Français'
        }
      ],
      defaultLocale: 'en',
      lazy: false,
      vueI18n: {
        messages: {
          fr: {
            home: 'Accueil',
            about: 'À propos',
            posts: 'Articles'
          },
          en: {
            home: 'Homepage',
            about: 'About us',
            posts: 'Posts'
          }
        },
        fallbackLocale: 'en'
      }
    }]
  ],
  axios: {},
}
