const { resolve, join } = require('path')
const { readdirSync } = require('fs')
const i18nExtensions = require('vue-i18n-extensions')

const {
  MODULE_NAME,
  ROOT_DIR,
  PLUGINS_DIR,
  TEMPLATES_DIR,
  DEFAULT_OPTIONS,
  NESTED_OPTIONS,
  LOCALE_CODE_KEY,
  LOCALE_ISO_KEY,
  LOCALE_DOMAIN_KEY,
  LOCALE_FILE_KEY,
  STRATEGIES,
  COMPONENT_OPTIONS_KEY
} = require('./helpers/constants')

const { makeRoutes } = require('./helpers/routes')
const {
  getLocaleCodes,
  getLocaleFromRoute,
  getForwarded,
  getHostname,
  getLocaleDomain,
  syncVuex
} = require('./helpers/utils')

module.exports = function (userOptions) {
  const pluginsPath = join(__dirname, PLUGINS_DIR)
  const templatesPath = join(__dirname, TEMPLATES_DIR)
  const requiredPlugins = ['main', 'routing']
  const options = { ...DEFAULT_OPTIONS, ...userOptions }
  // Options that have nested config options must be merged
  // individually with defaults to prevent missing options
  for (const key of NESTED_OPTIONS) {
    if (options[key] !== false) {
      options[key] = { ...DEFAULT_OPTIONS[key], ...options[key] }
    }
  }

  const templatesOptions = {
    ...options,
    MODULE_NAME,
    LOCALE_CODE_KEY,
    LOCALE_ISO_KEY,
    LOCALE_DOMAIN_KEY,
    LOCALE_FILE_KEY,
    STRATEGIES,
    COMPONENT_OPTIONS_KEY,
    getLocaleCodes,
    getLocaleFromRoute,
    getForwarded,
    getHostname,
    getLocaleDomain,
    syncVuex,
    isSpa: this.options.mode === 'spa'
  }

  // Generate localized routes
  const pagesDir = this.options.dir && this.options.dir.pages ? this.options.dir.pages : 'pages'
  this.extendRoutes((routes) => {
    const localizedRoutes = makeRoutes(routes, {
      ...options,
      pagesDir
    })
    routes.splice(0, routes.length)
    routes.unshift(...localizedRoutes)
  })

  // Plugins
  for (const file of requiredPlugins) {
    this.addPlugin({
      src: resolve(pluginsPath, `${file}.js`),
      fileName: join(ROOT_DIR, `plugin.${file}.js`),
      options: templatesOptions
    })
  }

  // Templates
  for (const file of readdirSync(templatesPath)) {
    this.addTemplate({
      src: resolve(templatesPath, file),
      fileName: join(ROOT_DIR, file),
      options: templatesOptions
    })
  }

  // SEO plugin
  if (options.seo) {
    this.addPlugin({
      src: resolve(pluginsPath, `seo.js`),
      fileName: join(ROOT_DIR, `plugin.seo.js`),
      options: templatesOptions
    })
  }

  // Add vue-i18n to vendors if using Nuxt 1.x
  if (this.options.build.vendor) {
    this.options.build.vendor.push('vue-i18n')
  }

  // Add vue-i18n-loader if applicable
  if (options.vueI18nLoader) {
    this.extendBuild(config => {
      const loaders = config.module.rules.find(el => el.loader === 'vue-loader').options.loaders
      if (loaders) {
        // vue-loader under 15.0.0
        loaders.i18n = '@kazupon/vue-i18n-loader'
      } else {
        // vue-loader after 15.0.0
        config.module.rules.push({
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@kazupon/vue-i18n-loader'
        })
      }
    })
  }

  this.options.router.middleware.push('i18n')
  this.options.render.bundleRenderer.directives = this.options.render.bundleRenderer.directives || {}
  this.options.render.bundleRenderer.directives.t = i18nExtensions.directive
}
