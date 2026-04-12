<script setup lang="ts">
import ProductCard from '@/entities/product/ui/product-card/ProductCard.vue'
import { productApi } from '@/entities/product/api/product'
import { onMounted, ref } from 'vue'
import type { Product } from '@/entities/product/model/types'
import { useCartStore } from '@/entities/cart'

const products = ref<Product[]>([])
const cart = useCartStore()

async function onAddProductToCart(productId: string) {
  await cart.addProductFromListing(productId)
}

onMounted(async () => {
  const data = await productApi.getProducts({ limit: 6 })
  if (data) {
    products.value = data.items
    console.log(products.value)
  }
})
</script>

<template>
  <div class="latest-products">
    <div class="app-container">
      <div class="latest-products__top">
        <h2 class="latest-products__title">Shop The Latest</h2>
        <RouterLink to="/shop" class="latest-products__view-all">View All</RouterLink>
      </div>
      <div class="latest-products__content">
        <div class="latest-products__list">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :discount-rate="product.discount"
            :product-images="product.product_images"
            :is-new="product.is_new"
            :is-sold-out="product.is_sold_out"
            @add-to-cart="() => onAddProductToCart(product.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.latest-products {
  $layout-min: 320px;
  $layout-max: 1440px;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: clamp(13px, 2.7vw, 39px);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: clamp(16px, 2.3vw, 33px);
    color: var(--light-colors-black---light);

    @media (max-width: (globalBreakpoints.$breakpoint-xs - 1px)) {
      font-weight: 400;
    }
  }

  &__view-all {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: clamp(14px, 1.4vw, 20px);

    color: var(--light-colors-accent---light);

    @media (max-width: (globalBreakpoints.$breakpoint-xs - 1px)) {
      font-weight: 400;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: globalFunctions.fluidValue(16px, 54px, $layout-min, $layout-max);
    row-gap: globalFunctions.fluidValue(26px, 86px, $layout-min, $layout-max);

    @media (max-width: (globalBreakpoints.$breakpoint-sm - 1px)) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
