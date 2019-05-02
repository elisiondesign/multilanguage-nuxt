import {Context} from 'nuxt-types';
import Vue from 'vue';

export default ({ app }: Context) => {
    Vue.prototype.$myPlugin = () : void => {
      const localePath = app.localePath('index')
      console.log('fired from my plugin');
      console.log(`localePath: ${localePath}`);
    }
  }