import DirectusSDK from '@directus/sdk-js';
import Sitemap, {SitemapMapping} from '@@/@types/multilanguage-nuxt/ISitemap';
import CustomPaths from '@@/@types/multilanguage-nuxt/ICustomPaths';

/**
 * Directus CMS manager
 * Constructs localized routes array in a SEO-friendly way for the sitemap module
 */
export default class DirectusSitemap {
  api: DirectusSDK
  appPages: Array<CustomPaths>
  config: Sitemap
  defaultLocale: string
  locales: Array<string>

  /**
   * Initiates configuration for the API communicatio
  * 
  * @param appPages Array of translated app pages
  * @param locales Targeted locale codes
  * @param defaultLocale Default locale code
  * @param config Sitemap's configuration
  */
  constructor(appPages: Array<CustomPaths>, locales: Array<string>, defaultLocale: string, config: Sitemap) {
    this.appPages = appPages;
    this.config = config;
    this.locales = locales;
    this.defaultLocale = defaultLocale;
    this.api = this.configureApi(config.url, config.project)
  }

  /**
   * Establish connection to Directus
   * @param url Directus' url
   * @param project Target project in multiproject environment
   */
  private configureApi(url: string, project: string) {
    return new DirectusSDK({
      url,
      project
    })
  }

  /**
   * Fetch entry from directus and get the targeted field for translation
   *  
   * @param tableName Directus' targeted table
   * @param field Targeted field in table
   * @param outer Whether to take field from the outside relation or the translated inner relation
   *              For instance. Project has translated title, but url is common for all of them => title is inner, url is outer
   */
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

  /**
   * Queue fetch and translation for later
   */
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

  /**
   * Exclude any locales that are present in Directus, but not supported in the application
   * 
   * @param translations 
   */
  private filterAllowedTranslations(translations) {
    return translations.map(translation => {
      const obj = {};
      Object.entries(translation).forEach(entry => {
        const code = entry[0];
        const content = entry[1]
        const localeAllowed = this.locales.includes(code)
        if(localeAllowed) {
          obj[code] = content;
        }
      })

      return obj;
    })
  }

  /**
   * Localize each nuxt page with dynamic part
   * The dynamic part is replaced by the targeted field from directus
   * 
   * @param nuxtPath Nuxt's path
   * @param locale Targeted locale code
   * @param mapping Configuration for the given path
   * @param translation Translations for the given path
   */
  private localizeRoute(
    nuxtPath: string,
    locale: string,
    mapping: SitemapMapping,
    translation: Array<any>
  ) {
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

  /**
   * Prepare localized routes for the sitemap's module
   * 
   * @param translations 
   */
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

  /**
   * Proccess supported locale and mapping in the configuration,
   * return array of sitemap routes
   */
  async getAppRoutesAsync() {
    const apiPool = this.prepareTranslationsAsync();
    let translations = await Promise.all(apiPool);
    translations = this.filterAllowedTranslations(translations)
    const localizedRoutes = this.prepareLocalizedRoutes(translations)

    return localizedRoutes
  }
}
