<template>
  <section>
    <h1 class="header">
      Nuxt TypeScript Starter
    </h1>
    <div class="cards">
      <nuxt-link to="/test">
        test
      </nuxt-link>
      main
    </div>
  </section>
</template>

<style scoped>
.header {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
