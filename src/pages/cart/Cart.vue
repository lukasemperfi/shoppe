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
    <h1 class="cart-page__heading">Cart</h1>
    <ul class="cart-page__list" role="list">
      <li v-for="item in items" :key="item.id" class="cart-page__item">
        <CartItemCard v-model:quantity="item.quantity" :item="item" @remove="removeItem" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
  width: 100%;
  font-family: var(--font-family);

  &__heading {
    margin: 0 0 24px;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 48px;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      gap: 40px;
    }
  }

  &__item {
    margin: 0;
    padding: 0;
  }
}
</style>
