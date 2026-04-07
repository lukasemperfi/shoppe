<script setup lang="ts">
withDefaults(
  defineProps<{
    emptyMessage?: string
  }>(),
  {
    emptyMessage: 'No reviews yet.',
  },
)
</script>

<template>
  <p class="product-reviews-panel__text">{{ emptyMessage }}</p>
</template>

<style scoped lang="scss">
.product-reviews-panel__text {
  margin: 0;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
  color: var(--light-colors-dark-gray---light);
}
</style>
