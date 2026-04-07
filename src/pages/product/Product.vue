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
