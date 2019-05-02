<template>
  <div>
    <nuxt-link
      v-for="(locale, index) in getLocales"
      :key="index"
      :exact="true"
      :to="changeLanguage(locale.code)"
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
    const locales: NuxtVueI18n.Options.LocaleObject[] = [];

    this.$i18n.locales.forEach(locale => {
      let locelaObject : NuxtVueI18n.Options.LocaleObject;
      if ((<NuxtVueI18n.Options.LocaleObject>locale).code) {
        locelaObject = (<NuxtVueI18n.Options.LocaleObject>locale);
      } else {
        locelaObject.code = <string>locale;
      }

      if (locelaObject.code !== this.$i18n.locale) {
        locales.push(locelaObject);
      }
    });

    return locales;
  }
}
</script>
