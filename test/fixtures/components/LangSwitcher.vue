<template>
  <div>
    <nuxt-link
      v-for="(locale, index) in getLocales"
      :key="index"
      :exact="true"
      :to="switchLocalePath(locale.code)"
    >
      {{ locale.code }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import { NuxtVueI18n } from '../../../types/vue';

@Component
export default class extends Vue {

  get getLocales() {
    const locales = [];

    this.$i18n.locales.forEach(locale => {
      let code : string;
      if ((<NuxtVueI18n.Options.LocaleObject>locale).code) {
        code = (<NuxtVueI18n.Options.LocaleObject>locale).code;
      } else {
        code = <string>locale;
      }

      if (code !== this.$i18n.locale) {
        locales.push(locale);
      }
    });

    return locales;
  }
}
</script>
