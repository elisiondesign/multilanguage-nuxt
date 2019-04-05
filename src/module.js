const { join } = require('path')

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
  syncVuex
} = require('./helpers/utils')

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


  // // Generate localized routes
  // const pagesDir = this.options.dir && this.options.dir.pages ? this.options.dir.pages : 'pages'
  // this.extendRoutes((routes) => {
  //   const localizedRoutes = makeRoutes(routes, {
  //     ...options,
  //     pagesDir
  //   })
  //   routes.splice(0, routes.length)
  //   routes.unshift(...localizedRoutes)
  // })

  this.addPlugin({
    src: join(__dirname, './plugin.js'),
    fileName: 'multilanguage-nuxt.js',
    options
  })
}

module.exports.meta = require('../package.json')
