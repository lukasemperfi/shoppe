<script setup lang="ts">
import type { CartItem } from '@/entities/cart/model/types'
import { computed, ref } from 'vue'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'
import CartTotals from '@/pages/cart/ui/CartTotals.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'

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

const cartSubtotal = computed(() =>
  items.value.reduce((sum, line) => sum + line.price * line.quantity, 0),
)
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
          <Button variant="outline" class="cart-page__update-cart-btn">Update Cart</Button>
          <div class="coupon">
            <Input class="coupon__input" placeholder="Coupon Code" />
            <Button variant="primary" class="coupon__button">Apply Coupon</Button>
          </div>
        </div>
        <div class="cart-page__col-2">
          <CartTotals :subtotal="cartSubtotal" />
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
    display: flex;
    flex-direction: column;
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
  }

  &__item {
    padding-block: globalFunctions.fluidValue(22px, 39px, 320px, 1440px);
    border-bottom: 1px solid var(--light-colors-gray---light);

    &:first-child {
      padding-top: 0;
    }
  }

  &__update-cart-btn {
    align-self: flex-end;
    margin-top: globalFunctions.fluidValue(24px, 39px, 320px, 1440px);
    margin-bottom: globalFunctions.fluidValue(48px, 64px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      width: 100%;
    }
  }

  .coupon {
    display: flex;
    gap: globalFunctions.fluidValue(16px, 76px, 320px, 1440px);

    :deep(.coupon__input::placeholder) {
      font-size: 12px;
    }

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      flex-direction: column;
    }
  }

  &__update-cart-btn,
  .coupon__button {
    min-width: 168px;
  }
}
</style>
