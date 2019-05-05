<template>
  <div>
    <lang-switcher />
    Dynamic part. <nuxt-link :to="nextPostLink">
      {{ nextPost }}
    </nuxt-link>
    <nuxt-link :to="localePath('index')">
      {{ $t('back') }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import LangSwitcher from '../../../components/LangSwitcher.vue'

@Component({
  components: {
    LangSwitcher
  }
})
export default class extends Vue {
  get nextPostLink() {
    return `${this.localePath('blog-title')}/${this.nextPost}`
  }

  get nextPost() {
    return parseInt(this.$route.params.title) + 1
  }
}
</script>
