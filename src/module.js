const { resolve, join } = require('path')
const { readdirSync } = require('fs')

const {
  DEFAULT_OPTIONS,
  ROOT_DIR,
  TEMPLATES_DIR,
  PLUGINS_DIR,
  NESTED_OPTIONS,
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
  getHostname
} = require('./helpers/constants')

const { makeRoutes } = require('./helpers/routes')

module.exports = function (moduleOptions) {
  const initialOptions = {
    ...this.options['nuxt-multilanguage'],
    ...moduleOptions
  }

  const options = { ...DEFAULT_OPTIONS, ...initialOptions }
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

  const pluginsPath = join(__dirname, PLUGINS_DIR)
  const templatesPath = join(__dirname, TEMPLATES_DIR)

  this.addPlugin({
    src: resolve(pluginsPath, 'main.js'),
    fileName: join(ROOT_DIR, 'plugin.main.js'),
    options: templatesOptions
  })

  this.addPlugin({
    src: resolve(pluginsPath, 'routing.js'),
    fileName: join(ROOT_DIR, 'plugin.routing.js'),
    options: templatesOptions
  })

  // // Templates
  // this.addTemplate({
  //   src: resolve(templatesPath, 'middleware.js'),
  //   fileName: join('template.middleware.js'),
  //   options: templatesOptions
  // })

  for (const file of readdirSync(templatesPath)) {
    this.addTemplate({
      src: resolve(templatesPath, file),
      fileName: join(ROOT_DIR, file),
      options: templatesOptions
    })
  }

  this.options.router.middleware.push('i18n')
}

module.exports.meta = require('../package.json')
