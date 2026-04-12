<script setup lang="ts">
import { onMounted, ref, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery, useDebounceFn } from '@vueuse/core'
import Input from '@/shared/ui/input/Input.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Select from '@/shared/ui/select/Select.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import Toggle from './ui/Toggle.vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
import ProductCard from '@/entities/product/ui/product-card/ProductCard.vue'
import { productApi } from '@/entities/product/api/product'
import type { Product, GetProductsParams, ProductsSortBy } from '@/entities/product/model/types'
import { useCartStore } from '@/entities/cart'

const route = useRoute()
const cart = useCartStore()
const router = useRouter()

const PRICE_SLIDER_MIN = 0
const PRICE_SLIDER_MAX = 1000

const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  brooches: '1e9235bc-3529-4d07-9bd6-1e71ba6f81c8',
  bracelets: '429b69a4-beda-44ae-8088-fa3f6c39b081',
  rings: '9e02611e-331a-47d0-9c79-b8fced6e5d59',
  earrings: 'a952980e-63a5-4bf1-bd16-ae43eb7bf9c0',
  necklaces: 'f32ec6d9-facc-4352-b8b0-97dfa3b5d434',
}

const filters = reactive({
  search: (route.query.search as string) || '',
  category: (route.query.category as string) || 'all',
  sortBy: (route.query.sortBy as ProductsSortBy) || 'newest',
  priceRange: [
    Number(route.query.minPrice) || PRICE_SLIDER_MIN,
    Number(route.query.maxPrice) || PRICE_SLIDER_MAX,
  ],
  onSale: route.query.onSale === 'true',
  inStock: route.query.inStock === 'true',
})

const filtersPanelOpen = ref(false)
const isNarrowShopLayout = useMediaQuery('(max-width: 1024px)')
const products = ref<Product[]>([])
const isLoading = ref(false)

const shopByCategoryOptions = [
  { label: 'All', value: 'all' },
  { label: 'Brooches', value: 'brooches' },
  { label: 'Bracelets', value: 'bracelets' },
  { label: 'Rings', value: 'rings' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Necklaces', value: 'necklaces' },
]
const sortByOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price_low_to_high' },
  { label: 'Price: High to Low', value: 'price_high_to_low' },
]

const fetchProducts = async () => {
  isLoading.value = true

  const categorySlug = filters.category !== 'all' ? filters.category : ''
  const categoryId = categorySlug ? CATEGORY_SLUG_TO_ID[categorySlug] : undefined

  const apiParams: GetProductsParams = {
    searchName: filters.search || undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    categoryId,
    hasDiscount: filters.onSale || undefined,
    isSoldOut: filters.inStock || undefined,
    sortBy: filters.sortBy as ProductsSortBy,
    limit: 100,
  }

  console.log('apiParams', apiParams)

  const data = await productApi.getProducts(apiParams)
  if (data) {
    products.value = data.items

    console.log('products', data.items)
  }
  isLoading.value = false
}

const debouncedFetch = useDebounceFn(fetchProducts, 400)

watch(
  filters,
  (newFilters) => {
    const query: any = {}
    if (newFilters.search) query.search = newFilters.search
    if (newFilters.category !== 'all') query.category = newFilters.category
    if (newFilters.sortBy !== 'newest') query.sortBy = newFilters.sortBy
    if (newFilters.priceRange[0] !== PRICE_SLIDER_MIN) query.minPrice = newFilters.priceRange[0]
    if (newFilters.priceRange[1] !== PRICE_SLIDER_MAX) query.maxPrice = newFilters.priceRange[1]
    if (newFilters.onSale) query.onSale = 'true'
    if (newFilters.inStock) query.inStock = 'true'

    router.replace({ query })

    debouncedFetch()
  },
  { deep: true },
)

watch(isNarrowShopLayout, (narrow) => {
  if (!narrow) filtersPanelOpen.value = false
})

onMounted(() => {
  fetchProducts()
})

async function onAddProductToCart(productId: string) {
  await cart.addProductFromListing(productId)
}
</script>

<template>
  <div class="shop">
    <div class="app-container">
      <div class="catalog">
        <div class="catalog__top">
          <h1 class="catalog__title">Shop The Latest</h1>
        </div>
        <div class="catalog__body" :class="{ catalog__body_filters_open: filtersPanelOpen }">
          <button
            type="button"
            class="catalog__toggle-filters"
            :aria-expanded="filtersPanelOpen"
            @click="filtersPanelOpen = !filtersPanelOpen"
          >
            <Icon name="filter" />
            <span class="catalog__toggle-filters-text"> Filters </span>
          </button>

          <aside
            id="catalog-filters-panel"
            class="catalog__aside"
            :class="{ catalog__aside_open: filtersPanelOpen }"
          >
            <div class="catalog__aside-inner">
              <div class="filters-bar">
                <Input v-model="filters.search" placeholder="Search..." class="filters-bar__search">
                  <template #append>
                    <button type="button" @click="fetchProducts">
                      <Icon name="search" />
                    </button>
                  </template>
                </Input>

                <Select
                  v-model="filters.category"
                  :options="shopByCategoryOptions"
                  label="Shop by"
                  class="filters-bar__select-shop-by"
                />

                <Select
                  v-model="filters.sortBy"
                  :options="sortByOptions"
                  label="Sort by"
                  class="filters-bar__select-sort-by"
                />

                <div class="slider">
                  <Slider
                    v-model="filters.priceRange"
                    :min="PRICE_SLIDER_MIN"
                    :max="PRICE_SLIDER_MAX"
                    :lazy="false"
                    :tooltips="false"
                    class="slider__input"
                  />
                  <div class="slider__footer">
                    <span>Price: ${{ filters.priceRange[0] }} - ${{ filters.priceRange[1] }}</span>
                    <button class="slider__filter-btn" @click="fetchProducts">Filter</button>
                  </div>
                </div>

                <Toggle v-model="filters.onSale" class="filters-bar__on-sale" label="On sale" />
                <Toggle v-model="filters.inStock" class="filters-bar__in-stock" label="In stock" />
              </div>
            </div>
          </aside>

          <div class="catalog__main">
            <Loader v-if="isLoading" class="catalog__loader" />

            <div v-else class="catalog__products">
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
              <div v-if="products.length === 0" class="catalog__empty">
                No products found matching your filters.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.catalog {
  $layout-min: 320px;
  $layout-max: 1440px;
  margin-top: clamp(24px, 6.8vw, 97px);
  &__top {
    margin-bottom: clamp(16px, 2.8vw, 40px);
  }
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: clamp(20px, 2.2vw, 31px);
    color: var(--light-colors-black---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-weight: 400;
    }
  }
  &__body {
    display: flex;
    gap: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex-direction: column;
      gap: 0;
    }

    &_filters_open {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        gap: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);
      }
    }
  }

  &__body_filters_open &__toggle-filters {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      margin-bottom: 0;
    }
  }

  &__aside {
    flex: 0 0 262px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: none;
      width: 100%;
      display: grid;
      grid-template-rows: 0fr;
      margin-top: 0;
      transition:
        grid-template-rows 0.35s ease,
        margin-top 0.35s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &_open {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-template-rows: 1fr;
      }
    }

    &-inner {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        min-height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.28s ease;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    }
  }

  &__aside_open &__aside-inner {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      overflow: visible;
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__toggle-filters {
    display: none;
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      margin-bottom: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);
    }
  }

  &__toggle-filters-text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
  }

  &__main {
    flex: 1 1 948px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: 1 1 auto;
    }
  }

  .filters-bar {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);
    }

    :deep(.input-wrapper) {
      padding-bottom: globalFunctions.fluidValue(6px, 10px, $layout-min, $layout-max);
      margin-bottom: globalFunctions.fluidValue(9px, 39px, $layout-min, $layout-max);

      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.input) {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);

      &::placeholder {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
        color: var(--light-colors-dark-gray---light);
      }
    }

    :deep(.filters-bar__search) {
      button {
        svg {
          width: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
          height: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
        }
      }
    }

    :deep(.select) {
      .select__trigger {
        border: 1px solid var(--light-colors-gray---light);
        border-radius: 4px;
        padding-block: globalFunctions.fluidValue(6px, 17px, $layout-min, $layout-max);
        padding-inline: globalFunctions.fluidValue(6px, 11px, $layout-min, $layout-max);
      }

      .select__value {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);

        color: var(--light-colors-black---light);
      }

      .select__icon {
        svg {
          width: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
          height: globalFunctions.fluidValue(6px, 8px, $layout-min, $layout-max);
        }
      }
    }

    :deep(.filters-bar__select-shop-by) {
      margin-bottom: globalFunctions.fluidValue(3px, 14px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        grid-column: 1 / -1;
      }
    }
    :deep(.filters-bar__select-sort-by) {
      margin-bottom: globalFunctions.fluidValue(10px, 43px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        grid-column: 1 / -1;
      }
    }

    :deep(.filters-bar__on-sale) {
      margin-top: globalFunctions.fluidValue(8px, 38px, $layout-min, $layout-max);
      margin-bottom: globalFunctions.fluidValue(9px, 42px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.filters-bar__in-stock) {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.toggle) {
      .toggle__text {
        font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
      }

      .toggle__switch {
        width: globalFunctions.fluidValue(30px, 33px, $layout-min, $layout-max);
        height: globalFunctions.fluidValue(18px, 20px, $layout-min, $layout-max);
      }
      .toggle__track::after {
        width: globalFunctions.fluidValue(11px, 13px, $layout-min, $layout-max);
        height: globalFunctions.fluidValue(11px, 13px, $layout-min, $layout-max);
      }
    }

    .slider {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }

      &__input {
        --slider-bg: var(--light-colors-gray---light);
        --slider-connect-bg: var(--light-colors-black---light);
        --slider-connect-bg-disabled: var(--light-colors-gray);
        --slider-height: 2px;
        --slider-radius: 0px;

        --slider-handle-bg: var(--light-colors-black---light);
        --slider-handle-width: 2px;
        --slider-handle-height: 10px;
        --slider-handle-radius: 0px;
        --slider-handle-shadow: none;

        :deep(.slider-handle) {
          top: calc(
            (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 * -1
          ) !important;
        }
      }
      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: globalFunctions.fluidValue(6px, 13px, $layout-min, $layout-max);

        span {
          font-family: 'DM Sans', var(--font-family);
          font-weight: 400;
          font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
          line-height: globalFunctions.fluidValue(18px, 22px, $layout-min, $layout-max);
          color: #707070;
        }
      }
      &__filter-btn {
        font-family: 'DM Sans', var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
        color: #a18a68;
        background: transparent;
        border: 0;
        padding: 0;
        cursor: pointer;
      }
    }
    :deep(.input-wrapper),
    :deep(.filters-bar__select-shop-by),
    :deep(.filters-bar__select-sort-by),
    :deep(.filters-bar__on-sale),
    :deep(.filters-bar__in-stock) {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }

  &__products {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: globalFunctions.fluidValue(16px, 24px, $layout-min, $layout-max);
    row-gap: globalFunctions.fluidValue(24px, 70px, $layout-min, $layout-max);

    @media (max-width: (600px)) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
