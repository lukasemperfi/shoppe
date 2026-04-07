<script setup lang="ts">
import Header from '@/widgets/header/Header.vue'
import Footer from '@/widgets/footer/Footer.vue'
</script>
<template>
  <div class="app-layout">
    <Header />

    <main class="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding-bottom: clamp(72px, 17.3vw, 249px);
}
</style>
