import './middleware';
import Vue from 'vue'

const routesNameSeparator = '<%= options.routesNameSeparator %>'

/**
 * Override Vuei18n 'localePath' function
 * Prefix nuxt link with locale
 *
 * @param i18nPath
 * @param routerPath
 * @returns {function(*=, *=): *}
 */
function localePathFactory (i18nPath, routerPath) {
  const STRATEGIES = <%= JSON.stringify(options.STRATEGIES) %>
  const STRATEGY = '<%= options.strategy %>'
  const defaultLocale = '<%= options.defaultLocale %>'
  const defaultLocaleRouteNameSuffix = '<%= options.defaultLocaleRouteNameSuffix %>'

  return function localePath (route, locale) {
    debugger;

    // Abort if no route or no locale
    if (!route) return
    locale = locale || this[i18nPath].locale
    if (!locale) return

    // If route parameters is a string, use it as the route's name
    if (typeof route === 'string') {
      route = { name: route }
    }

    // Build localized route options
    let name = route.name + routesNameSeparator + locale

    // Match route without prefix for default locale
    if (locale === defaultLocale && STRATEGY === STRATEGIES.PREFIX_AND_DEFAULT) {
      name += routesNameSeparator + defaultLocaleRouteNameSuffix
    }

    const localizedRoute = Object.assign({}, route, { name })

    // Resolve localized route
    const router = this[routerPath]
    const resolved = router.resolve(localizedRoute)
    let { href } = resolved

    // Remove baseUrl from href (will be added back by nuxt-link)
    if (router.options.base) {
      const regexp = new RegExp(router.options.base)
      href = href.replace(regexp, '/')
    }

    return href
  }
}

/**
 * Override Vuei18n 'localePath' function
 * Change current locale
 *
 * @returns {switchLocalePath}
 */
function switchLocalePathFactory () {

  return function switchLocalePath (locale) {
    const name = this.getRouteBaseName()
    if (!name) {
      return ''
    }

    const { params, ...routeCopy } = this.$route
    const baseRoute = Object.assign({}, routeCopy, {
      name,
      params: { ...params, '0': params.pathMatch }
    })
    let path = this.localePath(baseRoute, locale)

    return path
  }
}

/**
 * Retreive basename from path string
 *
 * @param contextRoute
 * @returns {getRouteBaseName}
 */
function getRouteBaseNameFactory (contextRoute) {

  const routeGetter  = contextRoute ? route => route || contextRoute :
  function (route) {
    return route || this.$route
  }

  return function getRouteBaseName (route) {
    route = routeGetter.call(this, route)
    if (!route.name) {
      return null
    }
    return route.name.split(routesNameSeparator)[0]
  }
}

Vue.mixin({
  methods: {
    localePath: localePathFactory('$i18n', '$router'),
    changeLanguage: switchLocalePathFactory(),
    getRouteBaseName: getRouteBaseNameFactory()
  }
})


export default ({ app, route }) => {
  app.localePath = localePathFactory('i18n', 'router')
  app.changeLanguage = switchLocalePathFactory(),
  app.getRouteBaseName = getRouteBaseNameFactory(route)
}
