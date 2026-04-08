<script setup lang="ts">
import type { Review } from '@/entities/product/model/types'
import ReviewCard from '@/entities/product/ui/review-card/ReviewCard.vue'
import Button from '@/shared/ui/button/Button.vue'
import Modal from '@/shared/ui/modal/Modal.vue'
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

const isAddReviewModalOpen = ref(false)
</script>

<template>
  <div class="product-reviews-panel">
    <div class="product-reviews-panel__col-1">
      <h2 class="product-reviews-panel__title">2 Reviews for lira earings</h2>
      <Button
        class="product-reviews-panel__add-review-open-modal-btn"
        variant="outline"
        color="black"
        type="button"
        @click="isAddReviewModalOpen = true"
      >
        Add a Review
      </Button>
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

      <div
        class="product-reviews-panel__add-review-form product-reviews-panel__add-review-form_desktop"
      >
        Form
      </div>

      <Modal v-model="isAddReviewModalOpen">
        <template #header-center>Add a Review</template>
        <template #content>
          <div
            class="product-reviews-panel__add-review-form product-reviews-panel__add-review-form_modal"
          >
            Form
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-reviews-panel {
  display: flex;
  gap: globalFunctions.fluidValue(16px, 86px, globalBreakpoints.$breakpoint-sm, 1440px);

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    flex-direction: column;
  }

  &__col-1 {
    flex: 1 1 580px;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      flex: 1 1 100%;
    }
  }
  &__col-2 {
    flex: 1 1 580px;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      flex: 1 1 100%;
    }
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 20px, 320px, 1440px);
    color: var(--light-colors-black---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      display: none;
    }
  }

  .reviews {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);
    margin-top: globalFunctions.fluidValue(24px, 74px, 320px, 1440px);

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

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      display: none;
    }
  }

  &__add-review-open-modal-btn {
    display: none;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      display: flex;
      width: 100%;
    }

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }

  &__add-review-form {
    &_desktop {
      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        display: none;
      }
    }

    &_modal {
      padding: 24px;
    }
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
