<template>
  <section>
    <lang-switcher />
    <div class="cards">
      <nuxt-link :to="localePath('index', 'en')">
        index, always english
      </nuxt-link> <br>
      <nuxt-link :to="localePath('index')">
        {{ $t('home') }}
      </nuxt-link> <br>
      <nuxt-link :to="localePath({ name: 'index', params: { slug: 'cat' } })">
        {{ $t('home') }} as object
      </nuxt-link> <br>
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
}
</script>
