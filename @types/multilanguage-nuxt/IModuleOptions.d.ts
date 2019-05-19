import Locales from './ILocales';
import { I18nOptions } from 'vue-i18n';

export default interface ModuleOptions {
    seo: boolean,
    baseUrl: string,
    locales: Array<Locales> | Array<string>
    defaultLocale: string,
    routesNameSeparator: string,
    defaultLocaleRouteNameSuffix: string,
    strategy: string,
    vueI18n: I18nOptions
    pages: any,
    sitemap: {
      source: 'directus-7',
      url: 'https://api.elisiondesign.cz/', // <-- is public and read-only, no bearer token required
      project: 'elision',
      mappings: [
        {
          nuxtPage: 'blog', // app page, relates to first level nuxt page
          dynamicRoute: '_title', // the dynamic part (as defined in pages.js
          table: 'blog', // table name in directus
          field: 'slug' // Translated field to be included in the sitemap
        }
      ]
  }
}