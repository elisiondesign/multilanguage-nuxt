<template>
  <section>
    <h1 class="header">Nuxt TypeScript Starter</h1>
    <div class="cards">
      <nuxt-link to="/">test</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from "nuxt-property-decorator"


  @Component
  export default class extends Vue {
    mounted() {
      console.log(this.$aa);
      console.log(this.$ab);
    }
  }
</script>

<style scoped>
  .header {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
  }
</style>
