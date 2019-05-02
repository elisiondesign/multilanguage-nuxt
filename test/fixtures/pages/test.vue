<template>
  <section>
    <lang-switcher />
    <div class="cards">
      <nuxt-link to="/">
        test
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
}
</script>
