<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import AppButton from '@/shared/ui/button/Button.vue'

import img1 from '@/shared/assets/images/home-hero/img-1.jpg'
import img2 from '@/shared/assets/images/home-hero/img-2.jpg'
import img3 from '@/shared/assets/images/home-hero/img-3.jpg'
import img4 from '@/shared/assets/images/home-hero/img-4.jpg'
import img5 from '@/shared/assets/images/home-hero/img-5.jpg'

interface HeroSlide {
  id: number
  image: string
  title: string
  price: string
}

const slides: HeroSlide[] = [
  { id: 1, image: img1, title: 'Gold big hoops', price: '$ 68,00' },
  { id: 2, image: img2, title: 'Silver earrings', price: '$ 52,00' },
  { id: 3, image: img3, title: 'Pearl necklace', price: '$ 94,00' },
  { id: 4, image: img4, title: 'Gold bracelet', price: '$ 78,00' },
  { id: 5, image: img5, title: 'Diamond ring', price: '$ 120,00' },
]

const modules = [Pagination]
</script>

<template>
  <section class="hero">
    <div class="app-container hero__container">
      <Swiper
        class="hero__swiper"
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :pagination="{ clickable: true, el: '.hero__pagination' }"
      >
        <SwiperSlide v-for="slide in slides" :key="slide.id" class="hero__slide">
          <div class="hero__content">
            <p class="hero__title">{{ slide.title }}</p>
            <p class="hero__price">{{ slide.price }}</p>
            <AppButton variant="outline" color="white" class="hero__btn">View Product</AppButton>
          </div>
          <img class="hero__image" :src="slide.image" :alt="slide.title" />
        </SwiperSlide>
      </Swiper>
      <div class="hero__pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  width: 100%;
  padding-block: clamp(12px, 2vw, 24px);

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    padding-block: clamp(8px, 3vw, 16px);
  }

  &__container {
    position: relative;
  }

  &__swiper {
    width: 100%;
    aspect-ratio: 1248 / 646;
    border-radius: clamp(8px, 1.2vw, 16px);
    overflow: hidden;
    background-color: var(--light-colors-light-gray---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      aspect-ratio: 1;
    }

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      aspect-ratio: 288 / 354;
    }
  }

  &__slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      align-items: flex-end;
      padding-bottom: 26px;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      object-position: 94% 0%;
      height: 122%;
      transform: translateY(-3px);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 42%;
    padding-left: clamp(8px, 2.8vw, 40px);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      max-width: 100%;
    }
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: clamp(20px, 2.3vw, 33px);
    color: var(--light-colors-white---light);
    margin-bottom: clamp(3px, 1.1vw, 16px);
  }

  &__price {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: clamp(14px, 1.8vw, 26px);
    color: var(--light-colors-white---light);
    margin-bottom: clamp(10px, 3.5vw, 49px);
  }

  &__btn {
    align-self: flex-start;
    text-transform: none;
    font-size: clamp(12px, 1.4vw, 20px);
    padding-block: clamp(7px, 0.84vw, 12px);
    padding-inline: clamp(8px, 2.1vw, 30px);
  }
  :deep(.btn) {
    border: 2px solid var(--light-colors-white---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-weight: 400;
      border: 1px solid var(--light-colors-white---light);
    }
  }

  &__pagination {
    position: absolute;
    bottom: clamp(8px, 1.8vw, 26px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 13px;
    width: max-content;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      gap: 6px;
    }

    :deep(.swiper-pagination-bullet) {
      width: 10px;
      height: 10px;
      background: var(--light-colors-white---light);
      opacity: 1;
      border-radius: 100%;
      transition: all 0.3s ease;
      margin: 0 !important;
      border-color: var(--light-colors-white---light);
      transform: scale(1);

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        width: 8px;
        height: 8px;
      }

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        width: 4px;
        height: 4px;
      }
    }

    :deep(.swiper-pagination-bullet-active) {
      background: transparent;
      border: 1px solid var(--light-colors-white---light);
      transform: scale(1.7);

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        transform: scale(2.25);
      }
    }
  }
}
</style>
