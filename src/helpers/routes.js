const {
  MODULE_NAME,
  STRATEGIES
} = require('./constants')
const { getPageOptions, getLocaleCodes } = require('./utils')

/**
 * Extend Nuxt's array of routes with localized urls
 * For each of the available locale, generate a locale prefixed route
 * Depending on the strategy configuration, the prefixed route for default language may or may not exist
 *
 * @param baseRoutes
 * @param locales
 * @param defaultLocale
 * @param routesNameSeparator
 * @param defaultLocaleRouteNameSuffix
 * @param strategy
 * @param pages
 * @param encodePaths
 * @param pagesDir
 * @param differentDomains
 * @returns {Array}
 */
exports.makeRoutes = (baseRoutes, {
  locales,
  defaultLocale,
  routesNameSeparator,
  defaultLocaleRouteNameSuffix,
  strategy,
  pages,
  encodePaths,
  pagesDir,
  differentDomains
}) => {
  locales = getLocaleCodes(locales)
  let localizedRoutes = []

  const buildLocalizedRoutes = (route, routeOptions = {}, isChild = false) => {
    const routes = []
    const pageOptions = getPageOptions(route, pages, locales, pagesDir)

    // Component's specific options
    const componentOptions = {
      locales,
      ...pageOptions,
      ...routeOptions
    }
    // Double check locales to remove any locales not found in pageOptions
    // This is there to prevent children routes being localized even though
    // they are disabled in the configuration
    if (
      typeof componentOptions.locales !== 'undefined' && componentOptions.locales.length > 0 &&
      typeof pageOptions.locales !== 'undefined' && pageOptions.locales.length > 0) {
      componentOptions.locales = componentOptions.locales.filter(locale => (
        pageOptions.locales.indexOf(locale) !== -1
      ))
    }

    // Generate routes for component's supported locales
    for (let i = 0, length1 = componentOptions.locales.length; i < length1; i++) {
      const locale = componentOptions.locales[i]
      let { path } = route
      const { name } = route
      const localizedRoute = { ...route }

      // Skip if locale not in module's configuration
      if (locales.indexOf(locale) === -1) {
        // eslint-disable-next-line
        console.warn(`[${MODULE_NAME}] Can't generate localized route for route '${name}' with locale '${locale}' because locale is not in the module's configuration`)
        continue
      }

      // Make localized route name
      localizedRoute.name = name + routesNameSeparator + locale

      // Generate localized children routes if any
      if (route.children) {
        delete localizedRoute.name
        localizedRoute.children = []
        for (let i = 0, length1 = route.children.length; i < length1; i++) {
          localizedRoute.children = localizedRoute.children.concat(buildLocalizedRoutes(route.children[i], { locales: [locale] }, true))
        }
      }

      // Get custom path if any
      if (componentOptions.paths && componentOptions.paths[locale]) {
        path = encodePaths ? encodeURI(componentOptions.paths[locale]) : componentOptions.paths[locale]
      }

      // Add route prefix if needed
      const shouldAddPrefix = (
        // No prefix if app uses different locale domains
        !differentDomains &&
        // Only add prefix on top level routes
        !isChild &&
        // Skip default locale if strategy is PREFIX_EXCEPT_DEFAULT
        !(locale === defaultLocale && strategy === STRATEGIES.PREFIX_EXCEPT_DEFAULT)
      )

      if (locale === defaultLocale && strategy === STRATEGIES.PREFIX_AND_DEFAULT) {
        const nameDefault = localizedRoute.name + routesNameSeparator + defaultLocaleRouteNameSuffix
        routes.push({ ...localizedRoute, path, name: nameDefault })
      }

      if (shouldAddPrefix) {
        path = `/${locale}${path}`
      }

      localizedRoute.path = path

      routes.push(localizedRoute)
    }

    return routes
  }

  for (let i = 0, length1 = baseRoutes.length; i < length1; i++) {
    const route = baseRoutes[i]
    localizedRoutes = localizedRoutes.concat(buildLocalizedRoutes(route, { locales }))
  }

  return localizedRoutes
}
