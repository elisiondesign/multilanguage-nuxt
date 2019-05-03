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
import { NuxtVueI18n } from '@@/@types/multilanguage-nuxt'

@Component
export default class extends Vue {
  get getLocales() {
    const locales: NuxtVueI18n.Options.LocaleObject[] = []

    this.$i18n.locales.forEach((locale) => {
      let localeObject : NuxtVueI18n.Options.LocaleObject = { code: '' }
      if ((locale as NuxtVueI18n.Options.LocaleObject).code) {
        localeObject = (locale as NuxtVueI18n.Options.LocaleObject)
      } else {
        localeObject.code = (locale as string)
      }

      if (localeObject.code !== this.$i18n.locale) {
        locales.push(localeObject)
      }
    })

    return locales
  }
}
</script>
