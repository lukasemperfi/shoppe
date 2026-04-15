<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
import Loader from '@/shared/ui/loader/Loader.vue'

import { productApi } from '@/entities/product/api/product'
import type { Product } from '@/entities/product/model/types'
import { useAuthStore } from '@/entities/auth/model/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

function getDisplayPrice(price: number, discount: number | null): string {
  if (discount != null && discount > 0) {
    const effective = Math.min(1, Math.max(0, discount))
    const discounted = Math.round(price * (1 - effective) * 100) / 100
    return formatPrice(discounted)
  }
  return formatPrice(price)
}

async function fetchWishlist() {
  const userId = authStore.user?.id
  if (!userId) return

  isLoading.value = true
  error.value = null
  try {
    products.value = await productApi.getWishlistProducts(userId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load wishlist'
  } finally {
    isLoading.value = false
  }
}

async function removeItem(productId: string) {
  const userId = authStore.user?.id
  if (!userId) return

  try {
    await productApi.removeFromWishlist(userId, productId)
    products.value = products.value.filter((p) => p.id !== productId)
    toast.success('Removed from wishlist')
  } catch {
    toast.error('Failed to remove item from wishlist')
  }
}

function selectOption(productId: string) {
  router.push({ name: 'product', params: { id: productId } })
}

function getMainImage(product: Product): string | null {
  const main = product.product_images?.find((img) => img.is_main)
  return main?.url ?? product.product_images?.[0]?.url ?? null
}

onMounted(fetchWishlist)
</script>

<template>
  <div class="wishlist">
    <div class="app-container">
      <SectionLayout>
        <template #title>Your Wishlist</template>
        <template #content>
          <Loader v-if="isLoading" />
          <div
            v-else-if="error"
            class="wishlist-table__state wishlist-table__state_error"
            role="alert"
          >
            {{ error }}
          </div>
          <div v-else-if="products.length === 0" class="wishlist-table__state" aria-live="polite">
            Your wishlist is empty.
          </div>
          <div v-else class="wishlist-table" role="table" aria-label="Wishlist products">
            <div class="wishlist-table__scroll" tabindex="0" aria-label="Scrollable wishlist table">
              <div class="wishlist-table__grid" role="rowgroup">
                <div
                  class="wishlist-table__row wishlist-table__row_head"
                  role="row"
                  aria-hidden="true"
                >
                  <div
                    class="wishlist-table__cell wishlist-table__cell_head wishlist-table__cell_remove"
                    role="columnheader"
                  />
                  <div
                    class="wishlist-table__cell wishlist-table__cell_head wishlist-table__cell_product"
                    role="columnheader"
                  >
                    PRODUCT NAME
                  </div>
                  <div
                    class="wishlist-table__cell wishlist-table__cell_head wishlist-table__cell_price"
                    role="columnheader"
                  >
                    PRICE
                  </div>
                  <div
                    class="wishlist-table__cell wishlist-table__cell_head wishlist-table__cell_stock"
                    role="columnheader"
                  >
                    STOCK STATUS
                  </div>
                  <div
                    class="wishlist-table__cell wishlist-table__cell_head wishlist-table__cell_action"
                    role="columnheader"
                  />
                </div>

                <div
                  v-for="product in products"
                  :key="product.id"
                  class="wishlist-table__row wishlist-table__row_item"
                  role="row"
                >
                  <div class="wishlist-table__cell wishlist-table__cell_remove" role="cell">
                    <button
                      class="wishlist-table__remove-btn"
                      type="button"
                      aria-label="Remove from wishlist"
                      @click="removeItem(product.id)"
                    >
                      <Icon name="cross" class="wishlist-table__remove-icon" />
                    </button>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_product" role="cell">
                    <div class="wishlist-table__product product-card">
                      <img
                        v-if="getMainImage(product)"
                        class="product-card__thumb"
                        :src="getMainImage(product)!"
                        :alt="product.name"
                      />
                      <div v-else class="product-card__thumb" aria-hidden="true" />
                      <div class="product-card__title">{{ product.name }}</div>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_price" role="cell">
                    <div class="wishlist-table__meta-line">
                      <span class="wishlist-table__meta-label">Price</span>
                      <span class="wishlist-table__meta-value">{{
                        getDisplayPrice(product.price, product.discount)
                      }}</span>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_stock" role="cell">
                    <div class="wishlist-table__meta-line">
                      <span class="wishlist-table__meta-value wishlist-table__stock">{{
                        product.is_sold_out ? 'Out of Stock' : 'Available'
                      }}</span>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_action" role="cell">
                    <Button
                      class="wishlist-table__action-btn"
                      type="button"
                      @click="selectOption(product.id)"
                      >SELECT OPTION</Button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wishlist {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.wishlist-table {
  --wishlist-border: #d8d8d8;
  $mobile: 850px;
  font-family: var(--font-family);
  width: 100%;
  max-width: 1035px;
  margin-inline: auto;

  @media (max-width: $mobile) {
    border: 0;
  }

  &__scroll {
    overflow-x: auto;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--light-colors-black---light);
      outline-offset: 6px;
    }

    @media (max-width: $mobile) {
      overflow: visible;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 86fr 323fr 165fr 165fr 296fr;

    @media (max-width: $mobile) {
      grid-template-columns: 1fr;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: subgrid;
    align-items: center;
    grid-column: 1/-1;
    border-block: 1px solid var(--light-colors-gray---light);
    @media (max-width: $mobile) {
      border: none;
    }

    &_head {
      @media (max-width: $mobile) {
        display: none;
      }
    }

    &_item {
      @media (max-width: $mobile) {
        grid-template-columns: max-content 1fr 1fr;
        grid-template-areas:
          'remove product action'
          'remove price action'
          'remove stock action';
        border: 1px solid var(--light-colors-gray---light);
      }

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        grid-template-columns: max-content 1fr;
        grid-template-areas:
          'remove product'
          'remove price'
          'remove stock'
          'remove action';
      }
    }
  }

  &__cell {
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    height: 100%;
    border-inline: 1px solid var(--light-colors-gray---light);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: globalFunctions.fluidValue(30px, 56px, 320px, 1440px);
    padding-inline: globalFunctions.fluidValue(10px, 20px, 320px, 1440px);

    @media (max-width: $mobile) {
      border: none;
      padding: 5px;
    }

    &_remove {
      @media (max-width: $mobile) {
        border-right: 1px solid var(--light-colors-gray---light);
        grid-area: remove;
        align-self: start;
        justify-content: flex-start;
        padding: 0;
      }
    }

    &_head {
      color: var(--light-colors-black---light);
      white-space: nowrap;
      padding-block: globalFunctions.fluidValue(20px, 30px, 320px, 1440px);
    }

    &_product {
      padding-inline: globalFunctions.fluidValue(20px, 38px, 320px, 1440px);

      @media (max-width: $mobile) {
        grid-area: product;
        padding: 5px;
      }
    }
    &_price {
      @media (max-width: $mobile) {
        grid-area: price;
        justify-self: flex-start;
        padding: 5px;
      }
    }

    &_stock {
      @media (max-width: $mobile) {
        grid-area: stock;
        justify-self: flex-start;
        padding: 5px;
      }
    }

    &_action {
      @media (max-width: $mobile) {
        grid-area: action;
        justify-self: flex-end;
        padding: 5px;
      }

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        justify-self: flex-start;
      }
    }
  }

  &__remove-btn {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;

    &:focus-visible {
      outline: 2px solid var(--light-colors-black---light);
      outline-offset: 2px;
    }
  }

  &__remove-icon {
    width: 13px;
    height: 14px;
    display: block;
  }

  .product-card {
    display: flex;
    align-items: center;
    gap: 24px;
    width: 100%;

    @media (max-width: $mobile) {
      display: grid;
      grid-template-columns: 80px 1fr;
      align-items: center;
      gap: 14px;
    }

    &__thumb {
      width: 100px;
      height: 100px;
      border-radius: 4px;
      background: linear-gradient(135deg, #efefef, #dcdcdc);
      object-fit: cover;
      flex-shrink: 0;

      @media (max-width: $mobile) {
        width: 80px;
        height: 80px;
      }
    }

    &__title {
      font-weight: 400;
      color: var(--light-colors-black---light);
      white-space: nowrap;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    }
  }

  &__meta-line {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    gap: 12px;

    @media (max-width: $mobile) {
      justify-content: space-between;
    }
  }

  &__meta-label {
    display: none;
    font-size: 14px;
    line-height: 20px;
    color: var(--light-colors-dark-gray---light, #707070);

    @media (max-width: $mobile) {
      display: inline;
    }
  }

  &__meta-value {
    color: var(--light-colors-dark-gray---light, #707070);
  }

  &__state {
    padding-block: globalFunctions.fluidValue(40px, 80px, 320px, 1440px);
    text-align: center;
    color: var(--light-colors-dark-gray---light, #707070);
    font-size: globalFunctions.fluidValue(14px, 18px, 320px, 1440px);

    &_error {
      color: #c0392b;
    }
  }
}
</style>
