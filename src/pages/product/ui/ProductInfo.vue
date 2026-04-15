<script setup lang="ts">
import { computed, ref } from 'vue'

import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'
import Quantity from '@/shared/ui/quantity/Quantity.vue'
import Select from '@/shared/ui/select/Select.vue'

type ColorOption = { label: string; value: string | number }

const props = withDefaults(
  defineProps<{
    name: string
    price: number
    discount?: number | null
    oldPrice?: number | null
    averageRating?: number
    reviewCount?: number
    description: string
    isSoldOut?: boolean
    sku: string
    categoriesDisplay: string
    colorOptions?: ColorOption[]
    selectLabel?: string
    facebookUrl?: string
    instagramUrl?: string
    twitterUrl?: string
    isInWishlist?: boolean
  }>(),
  {
    discount: null,
    oldPrice: null,
    averageRating: 0,
    reviewCount: 0,
    isSoldOut: false,
    colorOptions: () => [],
    selectLabel: 'Choose an option',
    facebookUrl: '#',
    instagramUrl: '#',
    twitterUrl: '#',
    isInWishlist: false,
  },
)

const emit = defineEmits<{
  addToCart: []
  wishlistClick: []
}>()

const quantity = defineModel<number>('quantity', { default: 1 })
const selectedColor = defineModel<string | number>('selectedColor', { default: '' })

const isTextExpanded = ref(false)
const expandText = () => {
  isTextExpanded.value = true
}

function isPositiveDiscountRate(): boolean {
  const r = props.discount
  return r != null && r > 0
}

const displayListPrice = computed((): number | null => {
  if (isPositiveDiscountRate()) {
    return props.price
  }
  return props.oldPrice ?? null
})

const displayCurrentPrice = computed((): number => {
  if (isPositiveDiscountRate()) {
    const r = props.discount as number
    const effective = Math.min(1, Math.max(0, r))
    return Math.round(props.price * (1 - effective) * 100) / 100
  }
  return props.price
})

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

const reviewsLabel = computed(() => {
  const n = props.reviewCount
  if (n === 1) return '1 customer review'
  if (n === 0) return 'No reviews yet'
  return `${n} customer reviews`
})
</script>

<template>
  <div class="product-info">
    <h1 class="product-info__title">{{ name }}</h1>
    <div
      class="product-info__prices"
      :class="{ 'product-info__prices_discount': displayListPrice != null }"
    >
      <template v-if="displayListPrice != null">
        <span class="product-info__price product-info__price_old">
          {{ formatPrice(displayListPrice) }}
        </span>
        <span class="product-info__price product-info__price_current">
          {{ formatPrice(displayCurrentPrice) }}
        </span>
      </template>
      <p v-else class="product-info__price product-info__price_current">
        {{ formatPrice(displayCurrentPrice) }}
      </p>
    </div>

    <div class="product-info__rating">
      <StarsRate :rate="averageRating" readonly />
      <span class="product-info__reviews">{{ reviewsLabel }}</span>
    </div>

    <div class="product-info__text-block">
      <p class="product-info__text" :class="{ 'product-info__text_expanded': isTextExpanded }">
        {{ description }}
      </p>

      <button
        v-if="!isTextExpanded"
        type="button"
        class="product-info__text-more"
        aria-label="View more"
        @click="expandText"
      >
        View more <Icon name="chevron-right" />
      </button>
    </div>

    <template v-if="!isSoldOut">
      <div v-if="colorOptions.length" class="product-info__select">
        <Select v-model="selectedColor" :options="colorOptions" :label="selectLabel" />
      </div>

      <div class="product-info__buy">
        <Quantity v-model="quantity" />
        <Button
          variant="outline"
          color="black"
          class="product-info__add"
          @click="emit('addToCart')"
        >
          ADD TO CART
        </Button>
      </div>
    </template>
    <p v-else class="product-info__sold-out">Out of stock</p>

    <div class="product-info__social">
      <button
        type="button"
        class="product-info__social-btn product-info__wishlist-btn"
        :class="{ 'product-info__wishlist-btn_active': isInWishlist }"
        :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
        :aria-pressed="isInWishlist"
        @click="emit('wishlistClick')"
      >
        <Icon name="heart-2" />
      </button>

      <span class="product-info__social-sep" aria-hidden="true" />

      <div class="product-info__social-links">
        <button type="button" class="product-info__social-btn" aria-label="Email">
          <Icon name="mail" />
        </button>

        <a class="product-info__social-btn" :href="facebookUrl" aria-label="Facebook">
          <Icon name="facebook" />
        </a>
        <a class="product-info__social-btn" :href="instagramUrl" aria-label="Instagram">
          <Icon name="instagram" />
        </a>
        <a class="product-info__social-btn" :href="twitterUrl" aria-label="Twitter">
          <Icon name="twitter" />
        </a>
      </div>
    </div>

    <div class="product-info__meta">
      <div class="product-info__meta-row">
        <span class="product-info__meta-key">SKU:</span>
        <span class="product-info__meta-val">{{ sku }}</span>
      </div>
      <div class="product-info__meta-row">
        <span class="product-info__meta-key">Categories:</span>
        <span class="product-info__meta-val">{{ categoriesDisplay }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-info {
  width: 100%;
  padding-top: 0;

  @media (max-width: globalBreakpoints.$breakpoint-xs) {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(20px, 26px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(27px, 35px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(7px, 23px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      order: 1;
    }
  }

  &__prices {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 16px;
    row-gap: 4px;
    margin-bottom: globalFunctions.fluidValue(26px, 28px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      order: 2;
    }

    &_discount {
      .product-info__price_old {
        text-decoration: line-through;
        text-decoration-color: var(--light-colors-errors---light);
      }
    }
  }

  &__price {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);
    text-transform: capitalize;
    color: var(--light-colors-accent---light);

    &_old {
      color: var(--light-colors-errors---light);
    }

    &_current {
      color: var(--light-colors-accent---light);
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: globalFunctions.fluidValue(15px, 25px, 320px, 1440px);
    margin-bottom: 21px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__reviews {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;

    color: var(--light-colors-dark-gray---light);
  }

  &__text {
    margin-bottom: 41px;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);

    @media (max-width: 449px) {
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }
  }

  &__text_expanded {
    @media (max-width: 449px) {
      display: block;
      -webkit-line-clamp: initial;
      line-clamp: initial;
      overflow: visible;
    }
  }

  &__text-block {
    margin-bottom: 41px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      order: 4;
    }

    @media (max-width: 449px) {
      margin-bottom: 0;
    }
  }

  &__text-more {
    display: none;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--light-colors-accent---light);
    text-decoration: none;
    font-size: 12px;

    svg {
      width: 5px;
      height: 8px;
    }

    @media (max-width: 449px) {
      display: inline-flex;
    }
  }

  &__select {
    margin-bottom: 47px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__buy {
    display: grid;
    grid-template-columns: 102px 1fr;
    max-width: 486px;
    column-gap: 24px;
    align-items: center;
    margin-bottom: globalFunctions.fluidValue(16px, 41px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      grid-template-columns: 1fr;
      order: 3;
    }
  }

  &__sold-out {
    margin-bottom: globalFunctions.fluidValue(16px, 41px, 320px, 1440px);
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);
    text-transform: capitalize;
    color: var(--light-colors-errors---light);
  }

  &__add {
    height: 53px;
    font-weight: 700;
    line-height: 21px;
    letter-spacing: 0.02em;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      padding-inline: 10px;
      padding-block: 5px;
      height: auto;
      font-weight: 400;
      font-size: 12px;
    }
  }

  :deep(.btn) {
    border: 1px solid var(--light-colors-black---light);
    border-radius: 4px;
    background: var(--light-colors-white---light);
    color: var(--light-colors-black---light);
    text-transform: uppercase;
  }

  :deep(.quantity) {
    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__social {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--light-colors-dark-gray---light);
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
  }

  &__wishlist-btn {
    transition: color 0.2s ease;

    :deep(.heart-icon__fill) {
      fill: white;
    }

    &_active {
      :deep(.heart-icon__fill) {
        fill: var(--light-colors-dark-gray---light);
      }
    }
  }

  &__social-sep {
    width: 19.5px;
    height: 0;
    border-top: 1px solid var(--light-colors-gray---light);
    transform: rotate(90deg);
  }

  &__social-links {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__meta-row {
    display: flex;
    gap: 19px;
    font-family: var(--font-family);
  }

  &__meta-key {
    color: var(--light-colors-black---light);
    font-weight: 400;
    font-size: 16px;
  }

  &__meta-val {
    color: var(--light-colors-dark-gray---light);
    font-weight: 400;
    font-size: 16px;
  }
}
</style>
