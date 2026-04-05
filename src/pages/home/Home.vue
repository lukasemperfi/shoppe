<script setup lang="ts">
import HeroSection from '@/pages/home/sections/hero/Hero.vue'
import LatestProductsSection from '@/pages/home/sections/latest-products/LatestProducts.vue'
</script>

<template>
  <div class="home">
    <HeroSection />
    <LatestProductsSection />
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  width: 100%;

  :deep(.latest-products) {
    margin-block: clamp(13px, 2.7vw, 39px);
  }
}
</style>
