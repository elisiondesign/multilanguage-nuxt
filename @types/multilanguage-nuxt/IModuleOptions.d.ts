import Locales from './ILocales';
import { I18nOptions } from 'vue-i18n';
import Sitemap from './ISitemap';

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
    pagesDir: string,
    sitemap: Sitemap
}