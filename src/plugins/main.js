import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)

export default async ({ app, route, store, req }, inject) => {
  // Options
  const vuex = <%= JSON.stringify(options.vuex) %>

  // Helpers

  <% if (options.vuex) { %>
    // Register Vuex module
    if (store) {
      registerStoreModule(store, vuex)
    }
  <% } %>

  // Set instance options
  app.i18n = new VueI18n(<%= JSON.stringify(options.vueI18n) %>)
  app.i18n.locales = <%= JSON.stringify(options.locales) %>
  app.i18n.defaultLocale = '<%= options.defaultLocale %>'
  app.i18n.beforeLanguageSwitch = <%= options.beforeLanguageSwitch %>
  app.i18n.onLanguageSwitched = <%= options.onLanguageSwitched %>
  // Extension of Vue
  if (!app.$t) {
    app.$t = app.i18n.t
  }

  let locale = app.i18n.defaultLocale || null

  app.i18n.locale = locale;

  // Sync Vuex
  syncVuex(vuex, store, locale, app.i18n.getLocaleMessage(locale))

}

/**
 * Generate new Vuex instance
 * @param store
 * @param vuex
 */
function registerStoreModule(store, vuex) {
  store.registerModule(vuex.moduleName, {
    namespaced: true,
    state: () => ({
      locale: '',
      messages: {}
    }),
    actions: {
      setLocale ({ commit }, locale) {
        commit(vuex.mutations.setLocale, locale)
      },
      setMessages ({ commit }, messages) {
        commit(vuex.mutations.setMessages, messages)
      }
    },
    mutations: {
      [vuex.mutations.setLocale] (state, locale) {
        state.locale = locale
      },
      [vuex.mutations.setMessages] (state, messages) {
        state.messages = messages
      }
    }
  }, { preserveState: vuex.preserveState })
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

