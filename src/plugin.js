import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default async ({ app, route, store, req }, inject) => {
  // Options
  const vuex = <%= JSON.stringify(options.vuex) %>

  // Helpers
  // const syncVuex = <%= options.syncVuex %>


  // <% if (options.vuex) { %>
    // Register Vuex module
    if (store) {
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
  // <% } %>

  // Set instance options
  app.i18n = new VueI18n(<%= JSON.stringify(options.vueI18n) %>)
  app.i18n.locales = <%= JSON.stringify(options.locales) %>
  app.i18n.defaultLocale = '<%= options.defaultLocale %>'
  // Extension of Vue
  if (!app.$t) {
    app.$t = app.i18n.t
  }


  if (store && store.state.localeDomains) {
    app.i18n.locales.forEach(locale => {
      console.log(locale)
      locale.domain = store.state.localeDomains[locale.code];
    })
  }

  let locale = app.i18n.defaultLocale || null

  app.i18n.locale = locale;
  // <% if (options.retry) { %>const = 'test' <% } %>

  // Sync Vuex
  // syncVuex(locale, app.i18n.getLocaleMessage(locale))

  Vue.prototype.$aa = <%= JSON.stringify(options) %>
  Vue.prototype.$ab = store

}
