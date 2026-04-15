<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

import type { Product } from '@/entities/product/model/types'
import { productApi } from '@/entities/product/api/product'
import { useAuthStore } from '@/entities/auth/model/auth.store'
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
import SimilarItems from './sections/similar-items/SimilarItems.vue'
import { useCartStore } from '@/entities/cart'

const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()

const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : (id?.[0] ?? '')
})

const product = ref<Product | null>(null)
const quantity = ref(1)
const selectedColor = ref<string | number>('')

watch(
  productId,
  async (id) => {
    if (!id) {
      product.value = null
      return
    }
    product.value = await productApi.getProductById(id, auth.user?.id ?? null)
  },
  { immediate: true },
)

watch(
  () => product.value?.id,
  () => {
    selectedColor.value = ''
  },
)

async function refreshProduct() {
  const id = productId.value
  if (!id) return
  product.value = await productApi.getProductById(id, auth.user?.id ?? null)
}

const galleryImages = computed(() => product.value?.product_images ?? [])

const colorOptions = computed(() => {
  const colors = product.value?.product_colors ?? []
  return [
    { label: 'Choose an option', value: '' },
    ...colors.map((c) => ({ label: c.color_name, value: c.id })),
  ]
})

const categoriesDisplay = computed(() => {
  const links = product.value?.product_categories ?? []
  return links
    .map((l) => l.categories?.name)
    .filter((name): name is string => Boolean(name))
    .join(', ')
})

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

const reviewCount = computed(() => product.value?.review_count ?? 0)

const accordionItems = computed(() => [
  { id: 'description', title: 'Description' },
  { id: 'additional', title: 'Additional information' },
  { id: 'reviews', title: `Reviews(${reviewCount.value})` },
])

const productReviews = computed(() => product.value?.reviews ?? [])

const isWishlistLoading = ref(false)

async function onWishlistClick() {
  const p = product.value
  if (!p) return

  const userId = auth.user?.id
  if (!userId) {
    toast.error('Please log in to manage your wishlist')
    return
  }

  if (isWishlistLoading.value) return
  isWishlistLoading.value = true

  try {
    if (p.isInWishlist) {
      await productApi.removeFromWishlist(userId, p.id)
      product.value = { ...p, isInWishlist: false }
      toast.success('Removed from wishlist')
    } else {
      await productApi.addToWishlist(userId, p.id)
      product.value = { ...p, isInWishlist: true }
      toast.success('Added to wishlist')
    }
  } catch {
    toast.error('Failed to update wishlist')
  } finally {
    isWishlistLoading.value = false
  }
}

function onAddToCart() {
  const p = product.value
  if (!p || p.is_sold_out) return

  const colors = p.product_colors ?? []
  if (colors.length > 0) {
    const cid = String(selectedColor.value)
    if (!cid) return
    cart.addItem({
      productId: p.id,
      colorId: cid,
      quantity: quantity.value,
      product: p,
    })
    return
  }

  cart.addItem({
    productId: p.id,
    colorId: null,
    quantity: quantity.value,
    product: p,
  })
}
</script>

<template>
  <div class="product">
    <div class="product__container">
      <section class="product__info-section app-container">
        <div class="product__top">
          <ProductGallery :images="galleryImages" />

          <ProductInfo
            v-if="product"
            v-model:quantity="quantity"
            v-model:selected-color="selectedColor"
            :name="product?.name ?? ''"
            :price="product?.price ?? 0"
            :discount="product?.discount ?? 0"
            :average-rating="product?.average_rating ?? 0"
            :review-count="product?.review_count ?? 0"
            :description="productDescription"
            :is-sold-out="product?.is_sold_out ?? false"
            :sku="product?.sku ?? ''"
            :categories-display="categoriesDisplay"
            :color-options="colorOptions"
            :is-in-wishlist="product?.isInWishlist ?? false"
            @add-to-cart="onAddToCart"
            @wishlist-click="onWishlistClick"
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
              <ProductReviewsPanel
                :reviews="productReviews"
                :product-id="productId"
                :product-name="product?.name ?? ''"
                @review-added="refreshProduct"
              />
            </template>
          </Accordion>
        </div>

        <div class="product__tabs">
          <Tabs v-model="tabs" default-tab="description">
            <TabsList>
              <TabsTrigger id="description">Description</TabsTrigger>
              <TabsTrigger id="additional">Additional information</TabsTrigger>
              <TabsTrigger id="reviews">Reviews({{ reviewCount }})</TabsTrigger>
            </TabsList>

            <div class="product__tab-panels">
              <TabsPanel id="description">
                <ProductDescriptionPanel :text="productDetailsDescription" />
              </TabsPanel>
              <TabsPanel id="additional">
                <ProductSpecsPanel v-bind="productSpecs" />
              </TabsPanel>
              <TabsPanel id="reviews">
                <ProductReviewsPanel
                  :reviews="productReviews"
                  :product-id="productId"
                  :product-name="product?.name ?? ''"
                  @review-added="refreshProduct"
                />
              </TabsPanel>
            </div>
          </Tabs>
        </div>
      </section>
      <SimilarItems />
    </div>
  </div>
</template>

<style scoped lang="scss">
.product {
  width: 100%;
  padding-top: globalFunctions.fluidValue(17px, 127px, 320px, 1440px);

  &__container {
    width: 100%;
  }

  &__info-section {
    margin-bottom: globalFunctions.fluidValue(21px, 96px, 320px, 1440px);
  }

  &__top {
    display: grid;
    grid-template-columns: 699fr 486fr;
    gap: clamp(24px, 4.5vw, 63px);
    align-items: start;
    aspect-ratio: 1248/625;

    @media (max-width: 1439px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 959px) {
      grid-template-columns: 1fr;
      aspect-ratio: 1/2;
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
