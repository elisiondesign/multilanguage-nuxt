import DirectusSDK from '@directus/sdk-js';
import Sitemap, {SitemapMapping} from '@@/@types/multilanguage-nuxt/ISitemap';

export default class DirectusSitemap {
  api: DirectusSDK
  appPages: any
  config: Sitemap
  locales: Array<string>

  constructor(appPages, locales: Array<string>, config: Sitemap) {
    this.appPages = appPages;
    this.config = config;
    this.locales = locales;
    this.api = this.configureApi(config.url, config.project)
  }

  private configureApi(url: string, project: string) {
    return new DirectusSDK({
      url,
      project
    })
  }

  private async getApiTranslationsAsync(tableName: string, field: string, outer: boolean) {
    const output = {}

    await this.api.getItems(tableName, { fields: '*.*' })
      .then(res => res.data.forEach((entry) => {
        entry.translations.forEach((language) => {
          const value = outer ? entry[field] : language[field]
          if (output[language.language_code] === undefined) {
            output[language.language_code] = [value]
          } else {
           output[language.language_code].push(value)
          }
        })
      }))
  
    return output
  }

  private prepareTranslationsAsync() {
    const mappings = this.config.mappings
    return mappings.map(async (mapping) => {
      const response = await this.getApiTranslationsAsync(
          mapping.table,
          mapping.field,
          mapping.outer
        )
        return response
    })
  }

  private filterAllowedTranslations(translations) {
    return translations.map(translation => {
      const obj = {};
      Object.entries(translation).forEach(entry => {
        const localeAllowed = this.locales.includes(entry[0])
        if(localeAllowed) {
          obj[entry[0]] = entry[1];
        }
      })

      return obj;
    })
  }

  private localizeRoute(
    pageEntry: [string, {}], 
    locale: string,
    mapping: SitemapMapping,
    translation: Array<any>
    ): Array<string>{
    const nuxtPath: string = pageEntry[0]
    const pathTranslations: Object = pageEntry[1]

    const routePath = locale + pathTranslations[locale]
    const routes = []

    if (nuxtPath.includes(mapping.nuxtPage) && nuxtPath.includes(mapping.dynamicRoute)) {
      translation[locale].forEach(value => {
        const standardizedRoute = mapping.dynamicRoute.replace("_", "")
        const localizedEntry = routePath.replace(`:${standardizedRoute}\?`, value)
        routes.push(localizedEntry)
      });
    }
    return routes;
  }

  private prepareLocalizedRoutes(translations) {
    const mappings = this.config.mappings
    let routes = []

    // each entry in module's 'sitemap' option
    for (let i = 0; i < mappings.length; i++) {
      // For each locale defined in options
      for (let j = 0; j < this.locales.length; j++) {
        const mapping = mappings[i];
        const translation = translations[i];
        const locale = this.locales[j]
        Object.entries(this.appPages).forEach((pageEntry) => {
          const localizedRoutes = this.localizeRoute(pageEntry, locale, mapping, translation)
          routes = routes.concat(localizedRoutes)
        })
      }
    }

    return routes
  }

  async getAppRoutes() {
    
    const apiPool = this.prepareTranslationsAsync();
    let translations = await Promise.all(apiPool); // Promise here returns a single item array
    translations = this.filterAllowedTranslations(translations)
    const localizedRoutes = this.prepareLocalizedRoutes(translations)

    debugger
    return localizedRoutes
  }
}
