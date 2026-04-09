<script setup lang="ts">
import ProductCard from '@/entities/product/ui/product-card/ProductCard.vue'
import { productApi } from '@/entities/product/api/product'
import { onMounted, ref } from 'vue'
import type { Product } from '@/entities/product/model/types'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const products = ref<Product[]>([])

onMounted(async () => {
  const data = await productApi.getProducts({ limit: 6 })
  if (data) {
    products.value = data.items
  }
})
</script>

<template>
  <section class="similar-items">
    <div class="app-container">
      <div class="similar-items__top">
        <h2 class="similar-items__title">Similar Items</h2>
      </div>
      <div class="similar-items__content">
        <Swiper
          class="similar-items__swiper"
          :modules="[Navigation]"
          :navigation="true"
          :watch-overflow="true"
          :slides-per-view="'auto'"
          :space-between="12"
          :breakpoints="{
            1440: { slidesPerView: 3, spaceBetween: 54 },
          }"
        >
          <SwiperSlide v-for="product in products" :key="product.id" class="similar-items__slide">
            <ProductCard
              :id="product.id"
              :name="product.name"
              :price="product.price"
              :discount-rate="product.discount"
              :product-images="product.product_images"
              :is-new="product.is_new"
              :is-sold-out="product.is_sold_out"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.similar-items {
  $layout-min: 320px;
  $layout-max: 1440px;

  .app-container {
    @media (max-width: (359px)) {
      padding-right: 0;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: globalFunctions.fluidValue(13px, 47px, 320px, 1440px);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);

    @media (max-width: (globalBreakpoints.$breakpoint-xs - 1px)) {
      font-weight: 400;
    }
  }

  &__swiper {
    width: 100%;

    :deep(.swiper-wrapper) {
      align-items: stretch;
    }

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
      width: globalFunctions.fluidValue(30px, 40px, 320px, 1440px);
      height: globalFunctions.fluidValue(30px, 40px, 320px, 1440px);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
      color: var(--light-colors-black---light);
      transform: translateY(-50%);
      z-index: 2;
    }

    :deep(.swiper-button-prev svg path),
    :deep(.swiper-button-next svg path) {
      stroke: currentColor;
      stroke-width: 1px;
      stroke-linejoin: round;
    }

    :deep(.swiper-navigation-icon) {
      height: 50%;
    }

    :deep(.swiper-button-prev) {
      inset-inline-start: 8px;
    }

    :deep(.swiper-button-next) {
      inset-inline-end: 8px;
    }

    :deep(.swiper-button-disabled) {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__slide {
    height: auto;
    width: clamp(220px, 34vw, 420px);

    @media (max-width: (globalBreakpoints.$breakpoint-sm - 1px)) {
      width: clamp(220px, 74vw, 360px);
    }

    @media (max-width: 359px) {
      width: globalFunctions.fluidValue(
        136px,
        220px,
        320px,
        globalBreakpoints.$breakpoint-sm - 1px
      );
    }

    @media (min-width: 1440px) {
      width: auto;
    }
  }
}
</style>
