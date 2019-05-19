import { LOCALE_CODE_KEY } from '../constants'
import Locale from '@@/@types/multilanguage-nuxt/ILocales';
import NuxtRoute from '@@/@types/nuxt-types/IRoutes';
import IPageOptions from '@@/@types/multilanguage-nuxt/IPageOptions.d';

/**
 * Get an array of locale codes from a list of locales
 * @param  locales Locales list from nuxt config
 * @return         List of locale codes
 */
export default function getLocaleCodes (locales: Array<Locale> | Array<string> = []): Array<string>  {
  if (locales.length) {
    // If first item is a string, assume locales is a list of codes already
    if (typeof locales[0] === 'string') {
      return (locales as Array<string>)
    }
    // Attempt to get codes from a list of objects
    if (typeof locales[0][LOCALE_CODE_KEY] === 'string') {
      return (locales as Array<Locale>).map(locale => locale[LOCALE_CODE_KEY])
    }
  }
  return []
}

 /**
  * Retrieve page's options from the module's configuration for a given route
  * 
  * @param route    Pages options from module's configuration
  * @param pages    Locale from module's configuration
  * @param locales  Pages dir from Nuxt's configuration
  * @param pagesDir Page options
  */
export function getPageOptions (route: NuxtRoute, pages: any, locales: Array<string>, pagesDir: string) {
  const options: IPageOptions = {
    locales,
    paths: {}
  }
  const pattern = new RegExp(`${pagesDir}/`, 'i')
  const chunkName = route.chunkName ? route.chunkName.replace(pattern, '') : route.name
  const pageOptions = pages[chunkName]
  // Routing disabled
  if (pageOptions === false) {
    return false
  }
  // Skip if no page options defined
  if (!pageOptions) {
    return options
  }
  // Construct options object
  Object.keys(pageOptions).forEach((locale) => {
    // Remove disabled locales from page options
    if (pageOptions[locale] === false) {
      options.locales = options.locales.filter(l => l !== locale)
    } else if (typeof pageOptions[locale] === 'string') {
      // Set custom path if any
      options.paths[locale] = pageOptions[locale]
    }
  })
  return options
}
