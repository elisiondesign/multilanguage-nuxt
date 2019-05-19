import { LOCALE_CODE_KEY } from '../constants'
import Locale from '@@/@types/multilanguage-nuxt/ILocales';

/**
 * Get an array of locale codes from a list of locales
 * @param  {Array}  locales Locales list from nuxt config
 * @return {Array}          List of locale codes
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
