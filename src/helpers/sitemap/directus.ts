import DirectusSDK from '@directus/sdk-js';
import Sitemap, {SitemapMapping} from '@@/@types/multilanguage-nuxt/ISitemap';

export default class DirectusSitemap {
  api: DirectusSDK
  appPages: any
  config: Sitemap
  defaultLocale: string
  locales: Array<string>

  constructor(appPages, locales: Array<string>, defaultLocale: string, config: Sitemap) {
    this.appPages = appPages;
    this.config = config;
    this.locales = locales;
    this.defaultLocale = defaultLocale;
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
    nuxtPath: string,
    locale: string,
    mapping: SitemapMapping,
    translation: Array<any>) {
    const route = {
      url: '',
      links: []
    }

    if (nuxtPath.includes(mapping.nuxtPage) && nuxtPath.includes(mapping.dynamicRoute)) {
      
      Object.entries(translation).forEach(entry => {
        const code = entry[0];
        const content = entry[1];

        content.forEach(path => {
          if (code === this.defaultLocale) {
            route.url = code;
          }
          route.links.push({lang: code, url: `${locale}/${path}`})
        });
      })

    }

    return route;
  }

  private prepareLocalizedRoutes(translations) {
    const mappings = this.config.mappings
    let routes = []
    Object.keys(this.appPages).forEach(nuxtPath => {
    // each entry in module's 'sitemap' option
    for (let i = 0; i < mappings.length; i++) {
      // For each locale defined in options
      for (let j = 0; j < this.locales.length; j++) {
        const mapping = mappings[i];
        const translation = translations[i];
        const locale = this.locales[j]
        const localizedRoutes = this.localizeRoute(nuxtPath, locale, mapping, translation)
        routes = routes.concat(localizedRoutes)
      }
    }
  })

    return routes
  }

  async getAppRoutes() {
    const apiPool = this.prepareTranslationsAsync();
    let translations = await Promise.all(apiPool); // Promise here returns a single item array
    translations = this.filterAllowedTranslations(translations)
    const localizedRoutes = this.prepareLocalizedRoutes(translations)

    return localizedRoutes
  }
}
