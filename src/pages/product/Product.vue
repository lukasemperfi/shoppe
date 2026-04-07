<script setup lang="ts">
import { ref } from 'vue'

import type { ProductImage } from '@/entities/product/model/types'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'
import TabsPanel from '@/shared/ui/tabs/TabsPanel.vue'
import Accordion from '../../shared/ui/accordion/Accordion.vue'
import ProductGallery from './ui/ProductGallery.vue'
import ProductInfo from './ui/ProductInfo.vue'
import ProductDescriptionPanel from './ui/ProductDescriptionPanel.vue'
import ProductSpecsPanel from './ui/ProductSpecsPanel.vue'
import ProductReviewsPanel from './ui/ProductReviewsPanel.vue'

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

const colorOptions = [
  { label: 'Choose an option', value: '' },
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Rose', value: 'rose' },
]

const productDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.'

const productDetailsDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis. Nunc sed porta augue. Morbi porta tempor odio, in molestie diam bibendum sed.'

const productSpecs = {
  weight: '0.3 kg',
  dimensions: '15 × 10 × 1 cm',
  colours: 'Black, Browns, White',
  material: 'Metal',
} as const

const tabs = ref<'description' | 'additional' | 'reviews'>('description')
const accordionItems = [
  { id: 'description', title: 'Description' },
  { id: 'additional', title: 'Additional information' },
  { id: 'reviews', title: 'Reviews(0)' },
] as const
</script>

<template>
  <section class="product">
    <div class="app-container product__container">
      <div class="product__top">
        <ProductGallery :images="galleryImages" />

        <ProductInfo
          v-model:quantity="quantity"
          v-model:selected-color="selectedColor"
          name="Lira Earrings"
          :price="30"
          :discount="0.2"
          :old-price="null"
          :average-rating="5"
          :review-count="1"
          :description="productDescription"
          :is-sold-out="false"
          sku="12"
          categories-display="Fashion, Style"
          :color-options="colorOptions"
        />
      </div>

      <div class="product__accordion">
        <Accordion v-model="tabs" :items="accordionItems" aria-label="Product details">
          <template #description>
            <ProductDescriptionPanel :text="productDetailsDescription" />
          </template>
          <template #additional>
            <ProductSpecsPanel v-bind="productSpecs" />
          </template>
          <template #reviews>
            <ProductReviewsPanel />
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
              <ProductDescriptionPanel :text="productDetailsDescription" />
            </TabsPanel>
            <TabsPanel id="additional">
              <ProductSpecsPanel v-bind="productSpecs" />
            </TabsPanel>
            <TabsPanel id="reviews">
              <ProductReviewsPanel />
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
}
</style>
