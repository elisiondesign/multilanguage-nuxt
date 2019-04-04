const modulePath = require('../../src/index');

export default {
  env: {},
  head: {
    title: "my-project",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js TypeScript project" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: { color: "#3B8070" },
  build: {
    extend (config: any, { isDev }: any) {
      if (isDev) {
        config.devtool = 'eval-source-map'  // Something you like
      }
    }
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
