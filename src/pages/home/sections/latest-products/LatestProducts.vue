<script setup lang="ts">
import ProductCard from '@/entities/product/ui/product-card/ProductCard.vue'
import { productApi } from '@/entities/product/api/product'
import { onMounted, ref } from 'vue'
import type { Product } from '@/entities/product/model/types'
import type { ProductCardBadge } from '@/entities/product/model/types'

const products = ref<Product[]>([])

onMounted(async () => {
  const data = await productApi.getProducts({ limit: 6 })
  if (data) {
    products.value = data.items
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
            :name="product.name"
            :price="product.price"
            :old-price="product.discount"
            :image-url="product?.product_images[0]?.url"
            :badge="
              {
                text: product.is_new
                  ? 'New'
                  : product.is_sold_out
                    ? 'Sold Out'
                    : product.discount
                      ? 'Sale'
                      : undefined,
                variant: product.is_new
                  ? 'new'
                  : product.is_sold_out
                    ? 'sold'
                    : product.discount
                      ? 'discount'
                      : undefined,
              } as ProductCardBadge
            "
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
