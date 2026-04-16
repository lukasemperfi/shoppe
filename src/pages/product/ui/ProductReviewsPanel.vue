<script setup lang="ts">
import { productApi } from '@/entities/product/api/product'
import type { Review } from '@/entities/product/model/types'
import ReviewCard from '@/entities/product/ui/review-card/ReviewCard.vue'
import AddReviewForm from '@/features/review/add-review/ui/AddReviewForm.vue'
import type { AddReviewFormValues } from '@/features/review/add-review/model/addReview.validation'
import Button from '@/shared/ui/button/Button.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import Modal from '@/shared/ui/modal/Modal.vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    reviews?: Review[]
    productId: string
    productName?: string
    emptyMessage?: string
  }>(),
  {
    reviews: () => [],
    productName: '',
    emptyMessage: 'No reviews yet.',
  },
)

const emit = defineEmits<{
  (e: 'review-added'): void
}>()

const reviewsTitle = computed(() => {
  const n = props.reviews.length
  const word = n === 1 ? 'Review' : 'Reviews'
  const name = props.productName.trim() || 'this product'
  return `${n} ${word} for ${name}`
})

const isAddReviewModalOpen = ref(false)
const isDesktop = useMediaQuery('(min-width: 1025px)')
const isAddReviewModalInstantClose = ref(false)

watch(isDesktop, (val) => {
  if (!val) return
  if (!isAddReviewModalOpen.value) return

  isAddReviewModalInstantClose.value = true
  isAddReviewModalOpen.value = false
  setTimeout(() => {
    isAddReviewModalInstantClose.value = false
  }, 0)
})

const addReviewFormKey = ref(0)

const isSubmittingReview = ref(false)

const handleAddReviewSubmit = async (value: AddReviewFormValues) => {
  const productId = props.productId?.trim()
  if (!productId || isSubmittingReview.value) return

  isSubmittingReview.value = true
  try {
    await productApi.addReview({
      product_id: productId,
      user_name: value.name,
      email: value.email,
      rating: value.rating,
      comment: value.comment ?? '',
    })
    isAddReviewModalOpen.value = false
    addReviewFormKey.value += 1
    emit('review-added')
  } catch {
  } finally {
    isSubmittingReview.value = false
  }
}
</script>

<template>
  <div class="product-reviews-panel">
    <div class="product-reviews-panel__col-1">
      <h2 class="product-reviews-panel__title">{{ reviewsTitle }}</h2>
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
        <Loader v-if="isSubmittingReview" label="Sending your review..." />
        <AddReviewForm
          v-else
          :key="`add-review-desktop-${addReviewFormKey}`"
          @submit="handleAddReviewSubmit"
        />
      </div>

      <Modal v-model="isAddReviewModalOpen" :instant-close="isAddReviewModalInstantClose">
        <template #header-center>Add a Review</template>
        <template #content>
          <div class="product-reviews-panel__add-review-form app-container">
            <Loader v-if="isSubmittingReview" label="Sending your review..." />
            <AddReviewForm
              v-else
              :key="`add-review-modal-${addReviewFormKey}`"
              @submit="handleAddReviewSubmit"
            />
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-reviews-panel {
  display: flex;
  gap: globalFunctions.fluidValue(38px, 86px, globalBreakpoints.$breakpoint-md, 1440px);

  @media (max-width: globalBreakpoints.$breakpoint-md) {
    flex-direction: column;
  }

  &__col-1 {
    flex: 1 1 580px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: 1 1 100%;
    }
  }
  &__col-2 {
    flex: 1 1 580px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: 1 1 100%;
    }
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 20px, 320px, 1440px);
    color: var(--light-colors-black---light);

    @media (max-width: globalBreakpoints.$breakpoint-md) {
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
    margin-bottom: globalFunctions.fluidValue(24px, 39px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: none;
    }
  }

  &__add-review-open-modal-btn {
    display: none;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: flex;
      width: 100%;
      justify-self: center;
      max-width: 50vw;
    }

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      max-width: 100%;
      justify-self: center;
    }

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }

  &__add-review-form {
    &_desktop {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
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

  &__add-review-form {
    padding-block: 16px;
  }
}
</style>
