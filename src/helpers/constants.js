const packageJson = require('../../package.json')

// Internals
exports.MODULE_NAME = packageJson.name
exports.ROOT_DIR = 'multilanguage-nuxt'
exports.HELPERS_PATH = 'helpers/'
exports.PLUGINS_DIR = 'plugins/'
exports.TEMPLATES_DIR = 'templates/'
exports.LOCALE_CODE_KEY = 'code'
exports.LOCALE_ISO_KEY = 'iso'

// Options
const STRATEGIES = {
  PREFIX: 'prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX_AND_DEFAULT: 'prefix_and_default'
}

exports.STRATEGIES = STRATEGIES

exports.COMPONENT_OPTIONS_KEY = 'nuxtI18n'
exports.DEFAULT_OPTIONS = {
  vueI18n: {},
  locales: [],
  defaultLocale: null,
  routesNameSeparator: '___',
  defaultLocaleRouteNameSuffix: 'default',
  strategy: STRATEGIES.PREFIX_AND_DEFAULT,
  rootRedirect: null,
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    alwaysRedirect: '',
    fallbackLocale: null
  },
  seo: true,
  baseUrl: '',
  vuex: {
    moduleName: 'i18n',
    mutations: {
      setLocale: 'I18N_SET_LOCALE',
      setMessages: 'I18N_SET_MESSAGES'
    },
    preserveState: false
  },
  pages: {},
  beforeLanguageSwitch: () => null,
  onLanguageSwitched: () => null
}
exports.NESTED_OPTIONS = ['detectBrowserLanguage', 'vuex']
