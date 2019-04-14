<template>
  <div>
    <nuxt-link
      v-for="(locale, index) in $i18n.locales"
      v-if="locale.code !== $i18n.locale"
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

@Component
export default class extends Vue {

}
</script>
