import { LOCALE_CODE_KEY } from './constants'

/**
 * Get an array of locale codes from a list of locales
 * @param  {Array}  locales Locales list from nuxt config
 * @return {Array}          List of locale codes
 */
const getLocaleCodes = (locales = []) => {
  if (locales.length) {
    // If first item is a string, assume locales is a list of codes already
    if (typeof locales[0] === 'string') {
      return locales
    }
    // Attempt to get codes from a list of objects
    if (typeof locales[0][LOCALE_CODE_KEY] === 'string') {
      return locales.map(locale => locale[LOCALE_CODE_KEY])
    }
  }
  return []
}

exports.getLocaleCodes = getLocaleCodes

/**
 * Retrieve page's options from the module's configuration for a given route
 * @param  {Object} route    Route
 * @param  {Object} pages    Pages options from module's configuration
 * @param  {Array} locales   Locale from module's configuration
 * @param  {String} pagesDir Pages dir from Nuxt's configuration
 * @return {Object}          Page options
 */
exports.getPageOptions = (locales) => {
  const options = {
    locales: getLocaleCodes(locales)
  }
  return options
}
