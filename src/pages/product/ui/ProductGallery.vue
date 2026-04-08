<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperInstance } from 'swiper/types'
import 'swiper/css'
import { useMediaQuery } from '@vueuse/core'

import type { ProductImage } from '@/entities/product/model/types'

const props = defineProps<{
  images: ProductImage[]
}>()

const orderedImages = computed(() => {
  return [...props.images].sort((a, b) => {
    if (a.is_main !== b.is_main) {
      return a.is_main ? -1 : 1
    }
    return a.order_index - b.order_index
  })
})

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
  } finally {
    thumbsSwiper.value = null
  }
})

watch(
  () => orderedImages.value.length,
  () => {
    activeIndex.value = 0
    mainSwiper.value?.slideTo(0, 0)
    thumbsSwiper.value?.slideTo(0, 0)
  },
)

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

const indicatorStyle = computed(() => {
  const count = orderedImages.value.length
  if (count <= 1) return { width: '0%', transform: 'translateX(0)' }

  const widthPercent = 100 / count
  const x = activeIndex.value * 100

  return {
    width: `${widthPercent}%`,
    transform: `translateX(${x}%)`,
  }
})

const thumbSlides = computed(() =>
  orderedImages.value.map((image, slideIndex) => ({ image, slideIndex })),
)
</script>

<template>
  <div v-if="orderedImages.length" class="product-gallery">
    <Swiper
      v-if="showThumbs"
      class="product-gallery__thumbs"
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
        v-for="slide in thumbSlides"
        :key="slide.image.id"
        class="product-gallery__thumb"
        :class="{ 'product-gallery__thumb_active': slide.slideIndex === activeIndex }"
        @click="goTo(slide.slideIndex)"
      >
        <img class="product-gallery__thumb-img" :src="slide.image.url" alt="Product thumbnail" />
      </SwiperSlide>
    </Swiper>

    <div class="product-gallery__main">
      <Swiper
        class="product-gallery__swiper"
        :slides-per-view="1"
        :space-between="0"
        :allow-touch-move="true"
        @swiper="onMainSwiper"
        @slideChange="syncFromMain"
      >
        <SwiperSlide v-for="image in orderedImages" :key="image.id" class="product-gallery__slide">
          <img class="product-gallery__image" :src="image.url" alt="Product image" />
        </SwiperSlide>
      </Swiper>

      <div class="product-gallery__progress" aria-hidden="true">
        <div class="product-gallery__progress-base" />
        <div class="product-gallery__progress-indicator" :style="indicatorStyle" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-gallery {
  display: grid;
  grid-template-columns: 120fr 540fr;
  column-gap: 39px;
  align-items: start;
  min-width: 0;

  @media (max-width: 1439px) {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }

  &__thumbs {
    width: 100%;
    height: auto;
    aspect-ratio: 120 / 600;
    max-height: 600px;

    @media (max-width: 1439px) {
      order: 2;
      aspect-ratio: 4 / 1;
    }
  }

  &__thumb {
    width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    transition:
      border-color 0.2s ease,
      opacity 0.2s ease;

    @media (hover: hover) {
      &:hover {
        border-color: var(--light-colors-gray---light);
      }
    }

    &_active {
      border: 2px solid var(--light-colors-black---light);
    }
  }

  &__thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__main {
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
    aspect-ratio: 540 / 600;
    border-radius: 8px;
    overflow: hidden;
    background: var(--light-colors-light-gray---light);

    @media (max-width: 1439px) {
      aspect-ratio: 1 / 1;
    }

    @media (max-width: 959px) {
      aspect-ratio: 288 / 374;
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
    margin-top: globalFunctions.fluidValue(15px, 23px, 320px, 1440px);
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
}
</style>
