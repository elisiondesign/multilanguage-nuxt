/**
 * Asynchronously load messages from translation files
 * @param  {VueI18n}  i18n  vue-i18n instance
 * @param  {String}   lang  Language code to load
 * @return {Promise}
 */
export async function loadLanguageAsync (i18n, locale) {
  const LOCALE_CODE_KEY = '<%= options.LOCALE_CODE_KEY %>'
  const LOCALE_FILE_KEY = '<%= options.LOCALE_FILE_KEY %>'

  if (!i18n.loadedLanguages) {
    i18n.loadedLanguages = []
  }
  if (!i18n.loadedLanguages.includes(locale)) {
    const langOptions = i18n.locales.find(l => l[LOCALE_CODE_KEY] === locale)
    if (langOptions) {
      const file = langOptions[LOCALE_FILE_KEY]
      if (file) {
        <% if (options.langDir) { %>
        try {
          const module = await import(/* webpackChunkName: "lang-[request]" */ '~/<%= options.langDir %>' + file)
          const messages = module.default ? module.default : module
          const result = typeof messages === 'function' ? await Promise.resolve(messages()) : messages
          i18n.setLocaleMessage(locale, result)
          i18n.loadedLanguages.push(locale)
          return result
        } catch (error) {
          console.error(error)
        }
        <% } %>
      } else {
        console.warn('[<%= options.MODULE_NAME %>] Could not find lang file for locale ' + locale)
      }
    }
  }
  return Promise.resolve()
}
