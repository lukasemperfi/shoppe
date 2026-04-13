<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapViewItemToCartItem, useCartStore } from '@/entities/cart'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'
import CartTotals from '@/pages/cart/ui/CartTotals.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'

const cart = useCartStore()
const router = useRouter()

const cartTotalsRef = ref<null | {
  applyShippingIfNeeded: () => Promise<void>
}>(null)

const cartSubtotal = computed(() => cart.totalSum)

function removeItem(cartItemId: string) {
  cart.removeItem(cartItemId)
}

async function onRefreshCart() {
  await cart.refreshViewItems()
}

async function onProceedToCheckout() {
  await cartTotalsRef.value?.applyShippingIfNeeded()
  router.push({ name: 'checkout' })
}
</script>

<template>
  <div class="cart-page">
    <div class="app-container">
      <h1 class="cart-page__title">Shopping Cart</h1>
      <div class="cart-page__body">
        <div class="cart-page__col-1">
          <p v-if="cart.viewItemsError" class="cart-page__message" role="alert">
            {{ cart.viewItemsError }}
          </p>
          <p v-else-if="cart.isViewItemsLoading && cart.items.length" class="cart-page__message">
            Loading cart…
          </p>
          <p v-else-if="!cart.items.length" class="cart-page__message">Your cart is empty.</p>
          <ul v-else class="cart-page__list" role="list">
            <li v-for="v in cart.viewItems" :key="v.cartItemId" class="cart-page__item">
              <CartItemCard
                :item="mapViewItemToCartItem(v)"
                :quantity="v.quantity"
                @update:quantity="(q) => cart.setQuantity(v.cartItemId, q)"
                @remove="removeItem"
              />
            </li>
          </ul>
          <Button
            variant="outline"
            class="cart-page__update-cart-btn"
            type="button"
            :disabled="!cart.items.length || cart.isViewItemsLoading"
            @click="onRefreshCart"
          >
            Update Cart
          </Button>
          <div class="coupon">
            <Input class="coupon__input" placeholder="Coupon Code" />
            <Button variant="primary" class="coupon__button">Apply Coupon</Button>
          </div>
        </div>
        <div class="cart-page__col-2">
          <CartTotals ref="cartTotalsRef" :subtotal="cartSubtotal" @checkout="onProceedToCheckout" />
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
      text-align: left;
    }
  }

  &__message {
    margin: 0 0 globalFunctions.fluidValue(16px, 32px, 320px, 1440px);
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
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
