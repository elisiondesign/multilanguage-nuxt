import {
  MODULE_NAME,
  STRATEGIES
} from '../constants'
import getLocaleCodes, {getPageOptions} from './utils'
import NuxtRoute from '@@/@types/nuxt-types/IRoutes'
import ModuleOptions from '@@/@types/multilanguage-nuxt/IModuleOptions.d';
import { ComponentOptions } from '@@/@types/nuxt-types';

/**
 * Extend Nuxt's array of routes with localized urls
 * For each of the available locale, generate a locale prefixed route
 * Depending on the strategy configuration, the prefixed route for default language may or may not exist
 */
export const makeRoutes = (baseRoutes: Array<NuxtRoute>, {
  locales,
  defaultLocale,
  routesNameSeparator,
  defaultLocaleRouteNameSuffix,
  pages,
  pagesDir,
  strategy,
}: ModuleOptions) => {
  const localeCodes = getLocaleCodes(locales)
  let localizedRoutes: Array<NuxtRoute> = []

  const buildLocalizedRoutes = (route: NuxtRoute, routeOptions: any = {}, isChild: boolean = false) => {
    const routes: Array<NuxtRoute> = []
    const pageOptions = getPageOptions(route, pages, locales, pagesDir)

    debugger
    // Component's specific options
    const componentOptions: any = {
      locales: localeCodes,
      ...pageOptions,
      ...routeOptions
    }

    // Generate routes for component's supported locales
    const localesLength = componentOptions.locales.length
    for (let i = 0; i < localesLength; i++) {
      const locale = componentOptions.locales[i]
      let { path } = route
      const { name } = route
      const localizedRoute = { ...route }

      // Skip if locale not in module's configuration
      if (localeCodes.indexOf(locale) === -1) {
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
        debugger
        path = componentOptions.paths[locale]
      }

      // Add route prefix if needed
      const shouldAddPrefix = (
        // No prefix if app uses different locale domains
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
    localizedRoutes = localizedRoutes.concat(buildLocalizedRoutes(route, { locales: localeCodes }))
  }

  return localizedRoutes
}
