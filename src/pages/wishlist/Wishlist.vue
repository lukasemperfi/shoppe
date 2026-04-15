<script setup lang="ts">
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'

type WishlistItem = {
  id: string
  title: string
  price: string
  stockStatus: 'In Stock' | 'Out of Stock'
}

const items: WishlistItem[] = [
  {
    id: 'ollie-earrings',
    title: 'Ollie Earrings',
    price: '$18.00',
    stockStatus: 'In Stock',
  },
  {
    id: 'lira-earrings',
    title: 'Lira Earrings',
    price: '$18.00',
    stockStatus: 'In Stock',
  },
]

function removeItem(_id: string) {
  // TODO: connect real wishlist store
}
</script>

<template>
  <div class="wishlist">
    <div class="app-container">
      <SectionLayout>
        <template #title>Your Wishlist</template>
        <template #content>
          <div class="wishlist-table" role="table" aria-label="Wishlist products">
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
                  v-for="item in items"
                  :key="item.id"
                  class="wishlist-table__row wishlist-table__row_item"
                  role="row"
                >
                  <div class="wishlist-table__cell wishlist-table__cell_remove" role="cell">
                    <button
                      class="wishlist-table__remove-btn"
                      type="button"
                      aria-label="Remove from wishlist"
                      @click="removeItem(item.id)"
                    >
                      <Icon name="cross" class="wishlist-table__remove-icon" />
                    </button>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_product" role="cell">
                    <div class="wishlist-table__product product-card">
                      <div class="product-card__thumb" aria-hidden="true" />
                      <div class="product-card__title">{{ item.title }}</div>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_price" role="cell">
                    <div class="wishlist-table__meta-line">
                      <span class="wishlist-table__meta-label">Price</span>
                      <span class="wishlist-table__meta-value">{{ item.price }}</span>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_stock" role="cell">
                    <div class="wishlist-table__meta-line">
                      <span class="wishlist-table__meta-value wishlist-table__stock">{{
                        item.stockStatus
                      }}</span>
                    </div>
                  </div>

                  <div class="wishlist-table__cell wishlist-table__cell_action" role="cell">
                    <Button class="wishlist-table__action-btn" type="button">SELECT OPTION</Button>
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
      display: none;
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

  &__action-btn {
  }
}
</style>
