import Vue from 'vue'
import { Context } from '@@/@types/nuxt-types/index.d'

export default ({ app }: Context) => {
  Vue.prototype.$myPlugin = () : void => {
    // eslint-disable-next-line
    const localePath = app.localePath('index')
  }
}
