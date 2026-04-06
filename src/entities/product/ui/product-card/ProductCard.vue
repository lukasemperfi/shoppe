<script setup lang="ts">
import type { ProductCardBadge, ProductCardBadgeVariant, ProductCardData } from '@/entities/product/model/types'
import { computed } from 'vue'

const props = withDefaults(defineProps<ProductCardData>(), {
  imageUrl: 'https://loremflickr.com/300/300/jewelry,earring',
  isSoldOut: false,
  oldPrice: null,
  isNew: false,
  hasDiscount: false,
})

const displayBadge = computed((): ProductCardBadge | null => {
  if (props.badge !== undefined) {
    return props.badge
  }
  if (props.isNew) {
    return { text: 'New', variant: 'new' }
  }
  if (props.isSoldOut) {
    return { text: 'Sold Out', variant: 'sold' }
  }
  if (props.hasDiscount) {
    return { text: 'Sale', variant: 'discount' }
  }
  return null
})

const emit = defineEmits<{
  addToCart: []
}>()

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

function badgeClass(variant: ProductCardBadgeVariant): string {
  return `product-card__badge--${variant}`
}

function onAddToCart(): void {
  if (props.isSoldOut) return
  emit('addToCart')
}
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img
        class="product-card__img"
        :src="imageUrl"
        :alt="name"
        width="300"
        height="300"
        loading="lazy"
        decoding="async"
      />
      <span
        v-if="displayBadge"
        class="product-card__badge"
        :class="badgeClass(displayBadge.variant)"
      >
        {{ displayBadge.text }}
      </span>
      <div v-if="!isSoldOut" class="product-card__overlay">
        <div class="product-card__overlay-bar">
          <button type="button" class="product-card__cart" @click="onAddToCart">Add to cart</button>
        </div>
      </div>
    </div>
    <div class="product-card__body">
      <h3 class="product-card__title">
        {{ name }}
      </h3>
      <div
        class="product-card__prices"
        :class="{ 'product-card__prices--discount': oldPrice != null }"
      >
        <template v-if="oldPrice != null">
          <span class="product-card__price product-card__price--old">
            {{ formatPrice(oldPrice) }}
          </span>
          <span class="product-card__price product-card__price--current">
            {{ formatPrice(price) }}
          </span>
        </template>
        <span v-else class="product-card__price product-card__price--current">
          {{ formatPrice(price) }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
$mobile-max: globalBreakpoints.$breakpoint-xs;

.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: var(--font-family);

  &__media {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--light-colors-light-gray---light);

    @media (max-width: $mobile-max) {
      border-radius: 4px;
    }

    &:focus-within .product-card__overlay {
      opacity: 1;
      pointer-events: auto;
    }

    @media (hover: hover) {
      &:hover .product-card__overlay {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__badge {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    padding: 0 7.5px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    font-family: var(--font-family);
    color: var(--light-colors-white---light);

    @media (max-width: $mobile-max) {
      top: 4px;
      left: 4px;
    }

    &--discount,
    &--sold {
      background-color: var(--light-colors-accent---light);
      color: var(--light-colors-white---light);
    }

    &--category {
      background-color: var(--light-colors-black---light);
      color: var(--light-colors-white---light);
    }

    &--new {
      background-color: var(--light-colors-white---light);
      color: var(--light-colors-black---light);
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    padding: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &__overlay-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 17.1%;
    min-height: 44px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0 0 8px 8px;

    @media (max-width: $mobile-max) {
      border-radius: 0 0 4px 4px;
    }
  }

  &__cart {
    padding: 8px 12px;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--light-colors-black---light);
    cursor: pointer;

    @media (max-width: $mobile-max) {
      font-size: 12px;
    }

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 2px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    gap: 16px;

    @media (max-width: $mobile-max) {
      margin-top: 8px;
      gap: 8px;
    }
  }

  &__title {
    margin: 0;
    font-size: clamp(14px, 1.4vw, 20px);
    font-weight: 400;
    color: var(--light-colors-black---light);
  }

  &__prices {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 16px;
    row-gap: 4px;

    &--discount {
      .product-card__price--old {
        text-decoration: line-through;
        text-decoration-color: var(--light-colors-errors---light);
      }
    }
  }

  &__price {
    font-size: clamp(12px, 1.4vw, 20px);
    font-weight: 500;
    text-transform: capitalize;
    color: var(--light-colors-accent---light);

    @media (max-width: $mobile-max) {
      font-weight: 400;
    }

    &--old {
      color: var(--light-colors-errors---light);
    }

    &--current {
      color: var(--light-colors-accent---light);
    }
  }
}
</style>
