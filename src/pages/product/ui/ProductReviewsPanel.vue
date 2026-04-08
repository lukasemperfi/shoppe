<script setup lang="ts">
import type { Review } from '@/entities/product/model/types'
import ReviewCard from '@/entities/product/ui/review-card/ReviewCard.vue'
import { ref } from 'vue'

withDefaults(
  defineProps<{
    emptyMessage?: string
  }>(),
  {
    emptyMessage: 'No reviews yet.',
  },
)

const reviews = ref<Review[]>([
  {
    id: '1',
    product_id: '1',
    user_name: 'Scarlet withch',
    email: 'john.doe@example.com',
    rating: 3,
    comment:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    created_at: '2020-05-06',
  },
  {
    id: '2',
    product_id: '1',
    user_name: 'Scarlet withch',
    email: 'john.doe@example.com',
    rating: 3,
    comment:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat.',
    created_at: '2020-05-06',
  },
])
</script>

<template>
  <div class="product-reviews-panel">
    <div class="product-reviews-panel__col-1">
      <h2 class="product-reviews-panel__title">2 Reviews for lira earings</h2>
      <div class="product-reviews-panel__reviews reviews">
        <ReviewCard
          v-for="review in reviews"
          :key="review.id"
          :review="review"
          class="reviews__item"
        />
      </div>
    </div>
    <div class="product-reviews-panel__col-2">
      <div class="product-reviews-panel__add-review">
        <div class="product-reviews-panel__add-review-title">Add a Review</div>
        <div class="product-reviews-panel__add-review-description">
          Your email address will not be published. Required fields are marked *
        </div>
      </div>
      <div class="product-reviews-panel__add-review-form">Form</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-reviews-panel {
  display: flex;
  gap: globalFunctions.fluidValue(24px, 86px, 320px, 1440px);

  &__col-1 {
    flex: 1 1 580px;
  }
  &__col-2 {
    flex: 1 1 580px;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 20px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(24px, 74px, 320px, 1440px);
  }

  .reviews {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);

    &__item {
      border-bottom: 1px solid var(--light-colors-gray---light);
      padding-bottom: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }

  &__add-review {
    margin-bottom: globalFunctions.fluidValue(24px, 53px, 320px, 1440px);
  }

  &__add-review-title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 20px;
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(14px, 17px, 320px, 1440px);
  }

  &__add-review-description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 13px;
    color: var(--light-colors-dark-gray---light);
    text-transform: capitalize;
  }
}
</style>
