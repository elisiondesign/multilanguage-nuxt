<template>
  <section>
    <lang-switcher />
    <div class="cards">
      <nuxt-link :to="localePath('test')">
        test
      </nuxt-link> <br />
      <nuxt-link :to="`${localePath('blog-title')}/1`">
        blog
      </nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import LangSwitcher from '../components/LangSwitcher.vue'

@Component({
  components: {
    LangSwitcher
  }
})
export default class extends Vue {
  mounted() {
    // Logging test of context plugin
    (this as any).$myPlugin()
  }
}
</script>
