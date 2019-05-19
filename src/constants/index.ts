export const SITEMAP_SOURCES = {
  DIRECTUS_7: 'directus-7'
}

import packageJson from '../../package.json';

// Internals
export const MODULE_NAME = packageJson.name
export const ROOT_DIR = 'multilanguage-nuxt'
export const HELPERS_PATH = 'helpers/'
export const PLUGINS_DIR = 'plugins/'
export const TEMPLATES_DIR = 'templates/'
export const LOCALE_CODE_KEY = 'code'
export const LOCALE_ISO_KEY = 'iso'

// Options
export const STRATEGIES = {
  PREFIX: 'prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX_AND_DEFAULT: 'prefix_and_default'
}


export const COMPONENT_OPTIONS_KEY = 'nuxtI18n'
export const DEFAULT_OPTIONS = {
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
export const NESTED_OPTIONS = ['detectBrowserLanguage', 'vuex']
