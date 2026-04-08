<script setup lang="ts">
import ReviewCard from '@/entities/product/ui/review-card/ReviewCard.vue'

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
  <ReviewCard
    :review="{
      id: '1',
      product_id: '1',
      user_name: 'Scarlet withch',
      email: 'john.doe@example.com',
      rating: 3,
      comment:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
      created_at: '2020-05-06',
    }"
  />
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
