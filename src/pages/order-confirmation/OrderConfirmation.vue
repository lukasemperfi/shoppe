<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { pinia } from '@/app/providers/pinia'
import { useCheckoutFlowStore } from '@/features/checkout-flow/model/checkout-flow.store'
import Button from '@/shared/ui/button/Button.vue'

const router = useRouter()
const flow = useCheckoutFlowStore(pinia)

const order = computed(() => flow.orderConfirmation)

function goToShop() {
  flow.resetFlow()
  router.push({ name: 'shop' })
}

function goToCart() {
  flow.resetFlow()
  router.push({ name: 'cart' })
}
</script>

<template>
  <div class="order-confirmation">
    <div class="app-container">
      <h1 class="order-confirmation__title">Order confirmation</h1>

      <div v-if="order" class="order-confirmation__body">
        <p class="order-confirmation__message" role="status">
          Thank you. Your order has been received.
        </p>

        <div class="order-summary" aria-label="Order summary">
          <div class="order-summary__grid">
            <div class="order-summary__item">
              <div class="order-summary__label">Order ID</div>
              <div class="order-summary__value">{{ order.orderId ?? '—' }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Email</div>
              <div class="order-summary__value">{{ order.payload.p_email }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Phone</div>
              <div class="order-summary__value">{{ order.payload.p_phone }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Payment method</div>
              <div class="order-summary__value">{{ order.payload.p_payment_method }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Delivery option</div>
              <div class="order-summary__value">{{ order.payload.p_delivery_option }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Shipping</div>
              <div class="order-summary__value">${{ order.payload.p_shipping_cost }}</div>
            </div>
            <div class="order-summary__item">
              <div class="order-summary__label">Total</div>
              <div class="order-summary__value">${{ order.payload.p_total_sum }}</div>
            </div>
          </div>

          <div class="order-summary__items">
            <div class="order-summary__items-title">Items</div>
            <ul class="order-summary__list" role="list">
              <li v-for="(i, idx) in order.payload.p_items" :key="idx" class="order-summary__list-item">
                <span class="order-summary__list-left">
                  Product: {{ i.product_id }}
                </span>
                <span class="order-summary__list-right">
                  Qty: {{ i.quantity }} · Price: ${{ i.price_at_purchase }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-confirmation__actions">
          <Button type="button" variant="primary" class="order-confirmation__btn" @click="goToShop">
            Go to shop
          </Button>
          <Button type="button" variant="outline" class="order-confirmation__btn" @click="goToCart">
            Back to cart
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-confirmation {
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

  &__body {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(16px, 28px, 320px, 1440px);
  }

  &__message {
    margin: 0;
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
  }

  &__actions {
    display: flex;
    gap: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      flex-direction: column;
    }
  }

  &__btn {
    min-width: 168px;
  }

  .order-summary {
    border: 1px solid var(--light-colors-gray---light);
    padding: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      border: none;
      padding: 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        grid-template-columns: 1fr;
      }
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__label {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
    }

    &__value {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
      color: var(--light-colors-black---light);
      word-break: break-word;
    }

    &__items {
      margin-top: globalFunctions.fluidValue(16px, 28px, 320px, 1440px);
    }

    &__items-title {
      font-family: var(--font-family);
      font-weight: 500;
      font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
      color: var(--light-colors-black---light);
      margin-bottom: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
    }

    &__list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
    }

    &__list-item {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-black---light);

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        flex-direction: column;
      }
    }

    &__list-left,
    &__list-right {
      word-break: break-word;
    }
  }
}
</style>

