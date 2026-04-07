<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ProductImage } from '@/entities/product/model/types'
import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'
import Quantity from '@/shared/ui/quantity/Quantity.vue'
import Select from '@/shared/ui/select/Select.vue'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'
import TabsPanel from '@/shared/ui/tabs/TabsPanel.vue'
import Accordion from '../../shared/ui/accordion/Accordion.vue'
import ProductGallery from './ui/ProductGallery.vue'

const galleryImages: ProductImage[] = [
  {
    id: '2',
    url: 'http://loremflickr.com/540/600/jewelry?lock=12',
    is_main: false,
    product_id: 'mock',
    order_index: 0,
  },
  {
    id: '1',
    url: 'http://loremflickr.com/540/600/jewelry?lock=11',
    is_main: true,
    product_id: 'mock',
    order_index: 1,
  },
  {
    id: '3',
    url: 'http://loremflickr.com/540/600/jewelry?lock=13',
    is_main: false,
    product_id: 'mock',
    order_index: 2,
  },
  {
    id: '4',
    url: 'http://loremflickr.com/540/600/jewelry?lock=14',
    is_main: false,
    product_id: 'mock',
    order_index: 3,
  },
]

const quantity = ref(1)
const selectedColor = ref<string | number>('')
const colors = [
  { label: 'Choose an option', value: '' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Rose', value: 'rose' },
]

const tabs = ref<'description' | 'additional' | 'reviews'>('description')
const accordionItems = [
  { id: 'description', title: 'Description' },
  { id: 'additional', title: 'Additional information' },
  { id: 'reviews', title: 'Reviews(0)' },
] as const

const isTextExpanded = ref(false)
const expandText = () => {
  isTextExpanded.value = true
}

const productPrice = 30
const productOldPrice: number | null = null
const discountRate: number | null = 0.2

const isSoldOut = true

function isPositiveDiscountRate(): boolean {
  const r = discountRate
  return r != null && r > 0
}

const displayListPrice = computed((): number | null => {
  if (isPositiveDiscountRate()) {
    return productPrice
  }
  return productOldPrice ?? null
})

const displayCurrentPrice = computed((): number => {
  if (isPositiveDiscountRate()) {
    const r = discountRate as number
    const effective = Math.min(1, Math.max(0, r))
    return Math.round(productPrice * (1 - effective) * 100) / 100
  }
  return productPrice
})

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <section class="product">
    <div class="app-container product__container">
      <div class="product__top">
        <ProductGallery :images="galleryImages" />

        <div class="product__info">
          <h1 class="product__title">Lira Earrings</h1>
          <div
            class="product__prices"
            :class="{ 'product__prices--discount': displayListPrice != null }"
          >
            <template v-if="displayListPrice != null">
              <span class="product__price product__price--old">
                {{ formatPrice(displayListPrice) }}
              </span>
              <span class="product__price product__price--current">
                {{ formatPrice(displayCurrentPrice) }}
              </span>
            </template>
            <p v-else class="product__price product__price--current">
              {{ formatPrice(displayCurrentPrice) }}
            </p>
          </div>

          <div class="product__rating">
            <StarsRate :rate="5" readonly />
            <span class="product__reviews">1 customer review</span>
          </div>

          <div class="product__text-block">
            <p class="product__text" :class="{ product__text_expanded: isTextExpanded }">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis.
            </p>

            <button
              v-if="!isTextExpanded"
              type="button"
              class="product__text-more"
              aria-label="View more"
              @click="expandText"
            >
              View more <Icon name="chevron-right" />
            </button>
          </div>
          <template v-if="!isSoldOut">
            <div class="product__select">
              <Select v-model="selectedColor" :options="colors" label="Choose an option" />
            </div>

            <div class="product__buy">
              <Quantity v-model="quantity" />
              <Button variant="outline" color="black" class="product__add">ADD TO CART</Button>
            </div>
          </template>
          <p v-else class="product__sold-out">Out of stock</p>
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

      <div class="product__accordion">
        <Accordion v-model="tabs" :items="accordionItems" aria-label="Product details">
          <template #description>
            <p class="product__tab-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis. Nunc sed porta augue. Morbi
              porta tempor odio, in molestie diam bibendum sed.
            </p>
          </template>
          <template #additional>
            <div class="product__additional">
              <div class="product__additional-panel product__additional-panel--specs">
                <dl class="product__specs">
                  <div class="product__spec">
                    <dt class="product__spec-key">Weight:</dt>
                    <dd class="product__spec-val">0.3 kg</dd>
                  </div>
                  <div class="product__spec">
                    <dt class="product__spec-key">Dimentions:</dt>
                    <dd class="product__spec-val">15 × 10 × 1 cm</dd>
                  </div>
                  <div class="product__spec">
                    <dt class="product__spec-key">Colours:</dt>
                    <dd class="product__spec-val">Black, Browns, White</dd>
                  </div>
                  <div class="product__spec">
                    <dt class="product__spec-key">Material:</dt>
                    <dd class="product__spec-val">Metal</dd>
                  </div>
                </dl>
              </div>
            </div>
          </template>
          <template #reviews>
            <p class="product__tab-text">No reviews yet.</p>
          </template>
        </Accordion>
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
              <div class="product__additional">
                <div class="product__additional-panel product__additional-panel--specs">
                  <dl class="product__specs">
                    <div class="product__spec">
                      <dt class="product__spec-key">Weight:</dt>
                      <dd class="product__spec-val">0.3 kg</dd>
                    </div>
                    <div class="product__spec">
                      <dt class="product__spec-key">Dimentions:</dt>
                      <dd class="product__spec-val">15 × 10 × 1 cm</dd>
                    </div>
                    <div class="product__spec">
                      <dt class="product__spec-key">Colours:</dt>
                      <dd class="product__spec-val">Black, Browns, White</dd>
                    </div>
                    <div class="product__spec">
                      <dt class="product__spec-key">Material:</dt>
                      <dd class="product__spec-val">Metal</dd>
                    </div>
                  </dl>
                </div>
              </div>
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
  padding-top: globalFunctions.fluidValue(17px, 127px, 320px, 1440px);

  &__container {
    width: 100%;
  }

  &__top {
    display: grid;
    grid-template-columns: 699fr 486fr;
    gap: clamp(24px, 4.5vw, 63px);
    align-items: start;

    @media (max-width: 1439px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 959px) {
      grid-template-columns: 1fr;
    }
  }

  &__info {
    width: 100%;
    padding-top: 0;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: flex;
      flex-direction: column;
    }
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

    &--discount {
      .product__price--old {
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

    &--old {
      font-size: 20px;
      color: var(--light-colors-errors---light);
    }

    &--current {
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
  .hidden {
    display: none;
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
    font-size: 16px;
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

  &__tabs {
    margin-top: 99px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__accordion {
    display: none;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: block;
      margin-top: 12px;
      padding-block: 17px;
      border-block: 1px solid var(--light-colors-gray---light);
    }

    :deep(.accordion__content) {
      padding-block: 17px;
    }
  }

  :deep(.tabs-list-wrapper) {
    .tabs-list {
      gap: globalFunctions.fluidValue(16px, 96px, 320px, 1440px);
      padding-bottom: globalFunctions.fluidValue(16px, 34px, 320px, 1440px);
    }
  }

  &__tab-panels {
    padding-top: globalFunctions.fluidValue(16px, 38px, 320px, 1440px);
  }

  &__tab-text {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
  }

  &__additional {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    max-width: 1248px;
    width: 100%;
    color: var(--light-colors-black---light);

    @media (max-width: 959px) {
      grid-template-columns: 1fr;
    }
  }

  &__additional-panel {
    width: 100%;
    min-width: 0;
  }

  &__specs {
    display: grid;
    gap: 10px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      gap: 4px;
    }
  }

  &__spec {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 13px;
    row-gap: 0;
    align-items: baseline;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: #000000;
  }

  &__spec-key {
    margin: 0;
    color: inherit;
    font-weight: 400;
  }

  &__spec-val {
    margin: 0;
    color: inherit;
    font-weight: 400;
    color: var(--light-colors-dark-gray---light);
  }
}
</style>
