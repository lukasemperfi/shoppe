<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperInstance } from 'swiper/types'
import 'swiper/css'
import { useMediaQuery } from '@vueuse/core'

import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'
import Quantity from '@/shared/ui/quantity/Quantity.vue'
import Select from '@/shared/ui/select/Select.vue'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'
import TabsPanel from '@/shared/ui/tabs/TabsPanel.vue'

type ProductSlide = {
  id: number
  lock: number
}

const slides: ProductSlide[] = [
  { id: 1, lock: 11 },
  { id: 2, lock: 12 },
  { id: 3, lock: 13 },
  { id: 4, lock: 14 },
]

const activeIndex = ref(0)
const mainSwiper = ref<SwiperInstance | null>(null)
const thumbsSwiper = ref<SwiperInstance | null>(null)

const showThumbs = useMediaQuery('(min-width: 960px)')

const onMainSwiper = (s: SwiperInstance) => {
  mainSwiper.value = s
}
const onThumbsSwiper = (s: SwiperInstance) => {
  thumbsSwiper.value = s
}

watch(showThumbs, (enabled) => {
  if (enabled) return
  try {
    thumbsSwiper.value?.destroy(true, true)
  } catch {
    // no-op
  } finally {
    thumbsSwiper.value = null
  }
})

const syncFromMain = (s: SwiperInstance) => {
  activeIndex.value = s.activeIndex
  if (thumbsSwiper.value && thumbsSwiper.value.activeIndex !== s.activeIndex) {
    thumbsSwiper.value.slideTo(s.activeIndex)
  }
}

const syncFromThumbs = (s: SwiperInstance) => {
  activeIndex.value = s.activeIndex
  if (mainSwiper.value && mainSwiper.value.activeIndex !== s.activeIndex) {
    mainSwiper.value.slideTo(s.activeIndex)
  }
}

const goTo = (index: number) => {
  mainSwiper.value?.slideTo(index)
}

// Удаляем жесткие константы PX
const indicatorStyle = computed(() => {
  const count = slides.length
  if (count <= 1) return { width: '0%', transform: 'translateX(0)' }

  // Ширина индикатора в процентах (например, если 4 слайда, один сегмент — 25%)
  const widthPercent = 100 / count
  const x = activeIndex.value * 100

  return {
    width: `${widthPercent}%`,
    transform: `translateX(${x}%)`,
  }
})

const quantity = ref(1)
const selectedColor = ref<string | number>('')
const colors = [
  { label: 'Choose an option', value: '' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Rose', value: 'rose' },
]

const tabs = ref<'description' | 'additional' | 'reviews'>('description')
</script>

<template>
  <section class="product">
    <div class="app-container product__container">
      <div class="product__top">
        <div class="product__gallery">
          <Swiper
            v-if="showThumbs"
            class="product__thumbs"
            direction="horizontal"
            :slides-per-view="4"
            :space-between="40"
            :allow-touch-move="true"
            @swiper="onThumbsSwiper"
            @slideChange="syncFromThumbs"
            :breakpoints="{
              960: {
                direction: 'horizontal',
                spaceBetween: 10,
              },
              1440: {
                direction: 'vertical',
                spaceBetween: 40,
              },
            }"
          >
            <SwiperSlide
              v-for="(slide, idx) in slides"
              :key="slide.id"
              class="product__thumb"
              :class="{ product__thumb_active: idx === activeIndex }"
              @click="goTo(idx)"
            >
              <img
                class="product__thumb-img"
                :src="`http://loremflickr.com/120/120/jewelry?lock=${slide.lock}`"
                alt="Product thumbnail"
              />
            </SwiperSlide>
          </Swiper>

          <div class="product__main">
            <Swiper
              class="product__swiper"
              :slides-per-view="1"
              :space-between="0"
              :allow-touch-move="true"
              @swiper="onMainSwiper"
              @slideChange="syncFromMain"
            >
              <SwiperSlide v-for="slide in slides" :key="slide.id" class="product__slide">
                <img
                  class="product__image"
                  :src="`http://loremflickr.com/540/600/jewelry?lock=${slide.lock}`"
                  alt="Product image"
                />
              </SwiperSlide>
            </Swiper>

            <div class="product__progress" aria-hidden="true">
              <div class="product__progress-base" />
              <div class="product__progress-indicator" :style="indicatorStyle" />
            </div>
          </div>
        </div>

        <div class="product__info">
          <h1 class="product__title">Lira Earrings</h1>
          <p class="product__price">$ 20,00</p>

          <div class="product__rating">
            <StarsRate :rate="5" readonly />
            <span class="product__reviews">1 customer review</span>
          </div>

          <p class="product__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
            volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
            quis mauris eget arcu facilisis consequat sed eu felis.
          </p>

          <div class="product__select">
            <!-- <span class="product__select-label">COLORS</span> -->
            <Select v-model="selectedColor" :options="colors" label="Choose an option" />
          </div>

          <div class="product__buy">
            <Quantity v-model="quantity" />
            <Button variant="outline" color="black" class="product__add">ADD TO CART</Button>
          </div>

          <div class="product__social">
            <button type="button" class="product__social-btn" aria-label="Add to wishlist">
              <Icon name="heart" />
            </button>

            <span class="product__social-sep" aria-hidden="true" />

            <div class="product__social-links">
              <button type="button" class="product__social-btn" aria-label="Email">
                <Icon name="mail" />
              </button>

              <a class="product__social-btn" href="#" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a class="product__social-btn" href="#" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a class="product__social-btn" href="#" aria-label="Twitter">
                <Icon name="twitter" />
              </a>
            </div>
          </div>

          <div class="product__meta">
            <div class="product__meta-row">
              <span class="product__meta-key">SKU:</span>
              <span class="product__meta-val">12</span>
            </div>
            <div class="product__meta-row">
              <span class="product__meta-key">Categories:</span>
              <span class="product__meta-val">Fashion, Style</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product__tabs">
        <Tabs v-model="tabs" default-tab="description">
          <TabsList>
            <TabsTrigger id="description">Description</TabsTrigger>
            <TabsTrigger id="additional">Additional information</TabsTrigger>
            <TabsTrigger id="reviews">Reviews(0)</TabsTrigger>
          </TabsList>

          <div class="product__tab-panels">
            <TabsPanel id="description">
              <p class="product__tab-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
                volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero.
                Sed quis mauris eget arcu facilisis consequat sed eu felis. Nunc sed porta augue.
                Morbi porta tempor odio, in molestie diam bibendum sed.
              </p>
            </TabsPanel>
            <TabsPanel id="additional">
              <p class="product__tab-text">Additional information will be here.</p>
            </TabsPanel>
            <TabsPanel id="reviews">
              <p class="product__tab-text">No reviews yet.</p>
            </TabsPanel>
          </div>
        </Tabs>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.product {
  width: 100%;
  padding-top: 127px;

  &__container {
    width: 100%;
  }

  &__top {
    display: grid;
    // Desktop: 2 колонки
    grid-template-columns: 699fr 486fr;
    column-gap: clamp(12px, 4.5vw, 64px);
    align-items: start;

    @media (max-width: 1439px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 959px) {
      grid-template-columns: 1fr;
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: 120fr 540fr;
    column-gap: 39px;
    align-items: start;
    min-width: 0;

    @media (max-width: 1439px) {
      // Переключаем сетку в одну колонку
      grid-template-columns: 1fr;
      row-gap: 20px; // Отступ между основным слайдером и превью
    }
  }

  &__thumbs {
    width: 100%;
    height: auto;
    // Пропорции для вертикального вида (Desktop)
    aspect-ratio: 120 / 600;
    max-height: 600px;

    @media (max-width: 1439px) {
      order: 2; // Thumbs под основным слайдером
      //   max-height: none;
      // В горизонтальном режиме: ширина 100%,
      // а высота должна соответствовать одному ряду квадратных превью.
      // Если у нас 4 слайда (как в конфиге), пропорция примерно 4 к 1.
      aspect-ratio: 4 / 1;
    }
  }

  &__thumb {
    width: 100%;
    aspect-ratio: 1 / 1; // Превью всегда квадратное
    height: auto;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    transition:
      border-color 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      border-color: var(--light-colors-gray---light);
    }

    &_active {
      border-color: var(--light-colors-black---light);
    }
  }

  &__thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__main {
    // Убираем фиксированные 540px
    width: 100%;
    min-width: 0;

    @media (max-width: 1439px) {
      order: 1;
    }

    @media (max-width: 959px) {
      order: 2;
    }
  }

  &__swiper {
    width: 100%;
    // Задаем пропорцию, чтобы высота считалась от текущей ширины
    aspect-ratio: 540 / 600;
    border-radius: 8px;
    overflow: hidden;
    background: var(--light-colors-light-gray---light);

    @media (max-width: 1439px) {
      aspect-ratio: 1 / 1;
    }
  }

  &__slide {
    width: 100%;
    height: 100%;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__progress {
    position: relative;
    width: 100%;
    height: 2px;
    margin-top: 22px;
  }

  &__progress-base {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0;
    border-top: 2px solid var(--light-colors-gray---light);
  }

  &__progress-indicator {
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    border-top: 2px solid var(--light-colors-dark-gray---light);
    transition: transform 0.25s ease;
    pointer-events: none;
  }

  &__info {
    width: 100%;
    padding-top: 0;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 26px;
    line-height: 35px;
    color: var(--light-colors-black---light);
    margin-bottom: 23px;
  }

  &__price {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 20px;
    text-transform: capitalize;
    color: var(--light-colors-accent---light);
    margin-bottom: 28px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-bottom: 21px;
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
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
  }

  &__select {
    margin-bottom: 47px;
  }

  &__select-label {
    display: inline-block;
    margin-bottom: 10px;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: var(--light-colors-dark-gray---light);
    letter-spacing: 0.02em;
  }

  &__buy {
    display: grid;
    // Колонки в кнопках тоже делаем более гибкими
    grid-template-columns: 102px 1fr;
    max-width: 486px;
    column-gap: 24px;
    align-items: center;
    margin-bottom: 41px;
  }

  &__add {
    height: 53px;
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
    letter-spacing: 0.02em;
  }

  :deep(.btn) {
    border: 1px solid var(--light-colors-black---light);
    border-radius: 4px;
    background: var(--light-colors-white---light);
    color: var(--light-colors-black---light);
    text-transform: uppercase;
  }

  &__social {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;
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

  &__tabs {
    margin-top: 99px;
  }

  :deep(.tabs-list-wrapper) {
    .tabs-list {
      gap: 96px;
      padding-bottom: 34px;
    }
  }

  &__tab-panels {
    padding-top: 38px;
  }

  &__tab-text {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
  }
}
</style>
