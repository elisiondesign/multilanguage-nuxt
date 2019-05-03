const modulePath = require('../../src/module')

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
            pages: {
                '__nested/customroute/index': {
                  en: '/:nested/myroute', 
                  cs: '/:nested/mojecesta' 
                }
              }
        }]
    ],
    axios: {},
    plugins: [
        "~/plugins/i18n-test",
        "~/plugins/myplugin"
    ],
    extend(config: any, ctx: any) {
        if (ctx.isDev) {
            config.devtool = 'eval-source-map'
        }
        config.devtool = 'eval'
    // config.devtool = ctx.isDev ? 'eval-source-map' : 'inline-source-map'
    }
}
