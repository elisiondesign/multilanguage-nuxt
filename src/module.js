import {
  DEFAULT_OPTIONS,
  ROOT_DIR,
  TEMPLATES_DIR,
  PLUGINS_DIR,
  NESTED_OPTIONS,
  MODULE_NAME,
  LOCALE_CODE_KEY,
  LOCALE_ISO_KEY,
  STRATEGIES
} from './constants'

const { resolve, join } = require('path')
const { readdirSync } = require('fs')

const { makeRoutes } = require('./helpers/routes')
const { makeSitemapRoutesAsync } = require('./helpers/sitemap')

module.exports = function (moduleOptions) {
  const initialOptions = {
    // options from nuxt.config.ts
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
    STRATEGIES
  }

  const pagesDir = this.options.dir && this.options.dir.pages ? this.options.dir.pages : 'pages'

  // Generate localized routes
  this.extendRoutes((routes) => {
    const localizedRoutes = makeRoutes(routes, {
      ...options,
      pagesDir
    })
    routes.splice(0, routes.length)
    routes.unshift(...localizedRoutes)
  })

  // Prepare routes for sitemap module and pass it the resolution promise-based function
  const sitemapRoutes = makeSitemapRoutesAsync(options)
  this.requireModule(['@nuxtjs/sitemap', { routes() { return sitemapRoutes } }])

  const pluginsPath = join(__dirname, PLUGINS_DIR)
  const templatesPath = join(__dirname, TEMPLATES_DIR)

  // Add plugins
  for (const pluginName of ['main', 'routing', 'seo']) {
    this.addPlugin({
      src: resolve(pluginsPath, `${pluginName}.js`),
      fileName: join(ROOT_DIR, `plugin.${pluginName}.js`),
      options: templatesOptions
    })
  }

  // Add templates
  for (const templatePath of readdirSync(templatesPath)) {
    this.addTemplate({
      src: resolve(templatesPath, templatePath),
      fileName: join(ROOT_DIR, `templates.${templatePath}`),
      options: templatesOptions
    })
  }

  // Register i18n middleware, defined in middleware template
  this.options.router.middleware.push('i18n')
}

module.exports.meta = require('../package.json')
