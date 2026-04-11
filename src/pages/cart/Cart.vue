<script setup lang="ts">
import type { CartItem } from '@/entities/cart/model/types'
import { ref } from 'vue'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'

const items = ref<CartItem[]>([
  {
    id: '1',
    title: 'Lira Earrings',
    description: 'Black / Medium',
    price: 20,
    quantity: 3,
    imageSrc: 'https://loremflickr.com/136/136/jewelry,earring?lock=11',
    imageAlt: 'Gold Lira hoop earrings',
  },
  {
    id: '2',
    title: 'Ollie Earrings',
    description: 'Gold / One size',
    price: 30,
    quantity: 1,
    imageSrc: 'https://loremflickr.com/136/136/jewelry,earring?lock=22',
    imageAlt: 'Gold Ollie earrings',
  },
  {
    id: '3',
    title: 'Kaede Hair Pin',
    description: 'Silver / Large',
    price: 30,
    quantity: 2,
    imageSrc: 'https://loremflickr.com/136/136/hairpin,jewelry?lock=33',
    imageAlt: 'Silver Kaede hair pin',
  },
])

function removeItem(id: string) {
  items.value = items.value.filter((line) => line.id !== id)
}
</script>

<template>
  <div class="cart-page">
    <div class="app-container">
      <h1 class="cart-page__title">Shopping Cart</h1>
      <div class="cart-page__body">
        <div class="cart-page__col-1">
          <ul class="cart-page__list" role="list">
            <li v-for="item in items" :key="item.id" class="cart-page__item">
              <CartItemCard v-model:quantity="item.quantity" :item="item" @remove="removeItem" />
            </li>
          </ul>
        </div>
        <div class="cart-page__col-2">
          <div class="cart-page__total">dfg</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
  font-family: var(--font-family);
  padding-top: globalFunctions.fluidValue(24px, 96px, 320px, 1440px);

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 31px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-align: center;
    margin-bottom: globalFunctions.fluidValue(15px, 65px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-weight: 400;
    }
  }

  &__body {
    display: flex;
    gap: globalFunctions.fluidValue(39px, 90px, 320px, 1440px);

    @media (max-width: 1300px) {
      flex-direction: column;
    }
  }

  &__col-1 {
    flex: 1 1 50%;
  }

  &__col-2 {
    flex: 1 1 50%;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      gap: 40px;
    }

    :deep(.cart-item-card) {
    }
  }

  &__item {
    padding-block: globalFunctions.fluidValue(22px, 39px, 320px, 1440px);
    border-bottom: 1px solid var(--light-colors-gray---light);

    &:first-child {
      padding-top: 0;
    }
  }
}
</style>
