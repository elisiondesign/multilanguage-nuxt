import middleware from '../middleware'

middleware['i18n'] = async ({ app, req, res, route, store, redirect, isHMR }) => {
  if (isHMR) {
    return
  }

  // Options
  const vuex = <%= JSON.stringify(options.vuex) %>

  // Helpers
  const routesNameSeparator = '<%= options.routesNameSeparator %>'
  const defaultLocaleRouteNameSuffix = '<%= options.defaultLocaleRouteNameSuffix %>'

  const localesList = <%= JSON.stringify(options.locales) %>
  const localeKey = '<%= options.LOCALE_CODE_KEY %>'
  const locales = getLocaleCodes(localeKey, localesList)

  let locale = app.i18n.locale || app.i18n.defaultLocale || null

  // Handle root path redirect
  const rootRedirect = '<%= options.rootRedirect %>'
  if (route.path === '/' && rootRedirect) {
    redirect('/' + rootRedirect, route.query)
    return
  }

  // Handle browser language detection
  const detectBrowserLanguage = <%= JSON.stringify(options.detectBrowserLanguage) %>
  const routeLocale = getLocaleFromRoute(route, routesNameSeparator, defaultLocaleRouteNameSuffix, locales)

  const { useCookie, cookieKey, alwaysRedirect, fallbackLocale } = detectBrowserLanguage

  const switchLocale = async (newLocale) => {
    // Abort if newLocale did not change
    if (newLocale === app.i18n.locale) {
      return
    }

    const oldLocale = app.i18n.locale
    app.i18n.beforeLanguageSwitch(oldLocale, newLocale)

    app.i18n.locale = newLocale
    app.i18n.onLanguageSwitched(oldLocale, newLocale)
    syncVuex(vuex, store, newLocale, app.i18n.getLocaleMessage(newLocale))
  }

  await switchLocale(routeLocale ? routeLocale : locale)
}

  /**
   * Get an array of locale codes from a list of locales
   * @param  {string} localeCodeKey Code of the locale
   * @param  {Array}  locales Locales list from nuxt config
   * @return {Array}          List of locale codes
   */
  function getLocaleCodes (localeCodeKey, locales = [])  {
    if (locales.length) {
      // If first item is a string, assume locales is a list of codes already
      if (typeof locales[0] === 'string') {
        return locales
      }
      // Attempt to get codes from a list of objects
      if (typeof locales[0][localeCodeKey] === 'string') {
        return locales.map(locale => locale[localeCodeKey])
      }
    }
    return []
  }

  /**
   * Extract locale code from given route:
   * - If route has a name, try to extract locale from it
   * - Otherwise, fall back to using the routes'path
   * @param  {Object} route               Route
   * @param  {String} routesNameSeparator Separator used to add locale suffixes in routes names
   * @param  {String} defaultLocaleRouteNameSuffix Suffix added to default locale routes names
   * @param  {Array}  locales             Locales list from nuxt config
   * @return {String}                     Locale code found if any
   */
  function getLocaleFromRoute (route = {}, routesNameSeparator = '', defaultLocaleRouteNameSuffix = '', locales = [])  {
    const codes = locales

    const localesPattern = `(${codes.join('|')})`
    const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
    // Extract from route name
    if (route.name) {
      const regexp = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, 'i')
      const matches = route.name.match(regexp)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    } else if (route.path) {
      // Extract from path
      const regexp = new RegExp(`^/${localesPattern}/`, 'i')
      const matches = route.path.match(regexp)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    }
    return null
  }

/**
 * Dispatch store module actions to keep it in sync with app's locale data
 * @param  {String} locale   Current locale
 * @param  {Object} messages Current messages
 * @return {void}
 */
function syncVuex (vuex, store, locale = null, messages = null) {
  if (vuex && store) {
    if (locale !== null && vuex.mutations.setLocale) {
      store.dispatch(vuex.moduleName + '/setLocale', locale)
    }
    if (messages !== null && vuex.mutations.setMessages) {
      store.dispatch(vuex.moduleName + '/setMessages', messages)
    }
  }
}
