<script setup lang="ts">
import { computed } from 'vue'

import type { Review } from '@/entities/product/model/types'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'

const props = defineProps<{
  review: Review
}>()

const displayDate = computed(() => {
  const raw = props.review.created_at
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw

  const base = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const parts = base.split(' ')
  if (parts.length < 3) return base
  return `${parts[0]} ${parts[1]}, ${parts[2]}`
})
</script>

<template>
  <article class="review-card">
    <header class="review-card__header">
      <div class="review-card__user-info">
        <h3 class="review-card__name">
          {{ review.user_name }}
        </h3>
        <time class="review-card__date" :datetime="review.created_at">{{ displayDate }}</time>
      </div>
      <div class="review-card__rating" aria-label="Rating">
        <StarsRate :rate="review.rating" readonly />
      </div>
    </header>

    <div class="review-card__body">
      <p v-if="review.comment" class="review-card__comment">
        {{ review.comment }}
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.review-card {
  &__header {
    margin-bottom: globalFunctions.fluidValue(10px, 25px, 320px, 1440px);
  }

  &__user-info {
    display: flex;
    align-items: baseline;
    gap: globalFunctions.fluidValue(10px, 16px, 320px, 1440px);
    margin-bottom: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
  }

  &__name {
    margin: 0;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 20px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 26px, 320px, 1440px);
    display: flex;
    align-items: center;
    color: var(--light-colors-black---light);
  }

  &__date {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(18px, 22px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
    white-space: nowrap;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      white-space: normal;
    }
  }

  &__rating {
    line-height: 0;
    width: globalFunctions.fluidValue(85px, 130px, 320px, 1440px);
  }

  &__comment {
    margin: 0;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 26px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
  }
}
</style>
