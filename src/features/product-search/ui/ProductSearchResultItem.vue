<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/entities/product/model/types'

const PLACEHOLDER_IMAGE = 'https://loremflickr.com/300/300/jewelry,earring'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  pick: []
}>()

const imageUrl = computed((): string => {
  const images = props.product.product_images ?? []
  if (!images.length) return PLACEHOLDER_IMAGE
  const main = images.find((img) => img.is_main)
  return main?.url ?? images[0]?.url ?? PLACEHOLDER_IMAGE
})

const discountRate = computed(() => props.product.discount)

const hasDiscount = computed(() => {
  const r = discountRate.value
  return r != null && r > 0
})

const currentPrice = computed((): number => {
  if (!hasDiscount.value) return props.product.price
  const r = discountRate.value as number
  const effective = Math.min(1, Math.max(0, r))
  return Math.round(props.product.price * (1 - effective) * 100) / 100
})

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

function onNavigate(): void {
  emit('pick')
}
</script>

<template>
  <RouterLink
    :to="`/product/${product.id}`"
    class="product-search-result"
    @click="onNavigate"
  >
    <span class="product-search-result__media">
      <img
        class="product-search-result__img"
        :src="imageUrl"
        :alt="product.name"
        width="56"
        height="56"
        loading="lazy"
        decoding="async"
      />
    </span>
    <span class="product-search-result__body">
      <span class="product-search-result__name">{{ product.name }}</span>
      <span class="product-search-result__prices">
        <span
          v-if="hasDiscount"
          class="product-search-result__price product-search-result__price_old"
        >
          {{ formatPrice(product.price) }}
        </span>
        <span class="product-search-result__price product-search-result__price_current">
          {{ formatPrice(currentPrice) }}
        </span>
      </span>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.product-search-result {
  $layout-min: 320px;
  $layout-max: 1440px;

  display: flex;
  align-items: center;
  gap: globalFunctions.fluidValue(10px, 14px, $layout-min, $layout-max);
  padding: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      background-color: var(--light-colors-light-gray---light);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--light-colors-accent---light);
    outline-offset: 2px;
  }

  &__media {
    flex-shrink: 0;
    width: globalFunctions.fluidValue(48px, 56px, $layout-min, $layout-max);
    height: globalFunctions.fluidValue(48px, 56px, $layout-min, $layout-max);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--light-colors-light-gray---light);
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: globalFunctions.fluidValue(4px, 6px, $layout-min, $layout-max);
    min-width: 0;
  }

  &__name {
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(13px, 15px, $layout-min, $layout-max);
    font-weight: 400;
    line-height: 1.35;
    color: var(--light-colors-black---light);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__prices {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: globalFunctions.fluidValue(6px, 10px, $layout-min, $layout-max);
  }

  &__price {
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    font-weight: 500;

    &_current {
      color: var(--light-colors-accent---light);
    }

    &_old {
      text-decoration: line-through;
      text-decoration-color: var(--light-colors-errors---light);
      color: var(--light-colors-errors---light);
      font-weight: 400;
    }
  }
}
</style>
