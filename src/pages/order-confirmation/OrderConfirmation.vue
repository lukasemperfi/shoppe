<script setup lang="ts">
import { computed } from 'vue'
import { pinia } from '@/app/providers/pinia'
import type { OrderAddressPayload } from '@/entities/order/model/types'
import { useCheckoutFlowStore } from '@/features/checkout-flow/model/checkout-flow.store'
import CheckoutTotals, { type CheckoutTotalsLineItem } from '@/pages/checkout/ui/CheckoutTotals.vue'
import Toast from '@/shared/ui/toast/Toast.vue'
import OrderDetails from './ui/OrderDetails.vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const flow = useCheckoutFlowStore(pinia)

const orderSummaryForTotals = computed(() => {
  const data = flow.orderConfirmation
  if (!data?.payload) {
    return { subtotal: 0, shippingCost: 0, total: 0, lineItems: [] as CheckoutTotalsLineItem[] }
  }
  const { payload, summaryLineItems } = data
  const subtotal = payload.p_items.reduce((sum, i) => sum + i.price_at_purchase * i.quantity, 0)
  return {
    subtotal,
    shippingCost: payload.p_shipping_cost,
    total: payload.p_total_sum,
    lineItems: summaryLineItems,
  }
})

const confirmationPayload = computed(() => flow.orderConfirmation?.payload ?? null)
const confirmationOrderId = computed(() => flow.orderConfirmation?.orderId ?? null)

function formatCountry(code: string): string {
  const map: Record<string, string> = {
    us: 'United States',
    uk: 'United Kingdom',
    de: 'Germany',
  }
  return map[code.toLowerCase()] ?? code
}

function formatDeliveryAddress(addr: OrderAddressPayload): string {
  const name = [addr.first_name, addr.last_name].filter(Boolean).join(' ')
  const cityLine = [String(addr.post_code), addr.city].filter(Boolean).join(' ')
  const parts = [
    name,
    addr.company_name?.trim(),
    addr.street_address,
    cityLine,
    formatCountry(addr.country),
  ]
  return parts.filter((p) => p && String(p).trim().length > 0).join(' ')
}

function formatDeliveryOption(value: string): string {
  if (value === 'standard') return 'Standard delivery'
  if (value === 'express') return 'Express delivery'
  return value
}

function formatPaymentMethod(value: string): string {
  const map: Record<string, string> = {
    direct_bank: 'Direct bank transfer',
    check: 'Check payments',
    cash_on_delivery: 'Cash on delivery',
    paypal: 'PayPal',
  }
  return map[value] ?? value
}

const orderDetailsProps = computed(() => {
  const payload = confirmationPayload.value
  const orderId = confirmationOrderId.value

  if (!payload) {
    return {
      orderNumber: '—',
      email: '—',
      paymentMethod: '—',
      orderDate: '—',
      deliveryOptions: '—',
      deliveryAddress: '—',
      contactNumber: '—',
    }
  }

  const orderDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return {
    orderNumber: orderId && orderId.length > 0 ? orderId : '—',
    email: payload.p_email,
    paymentMethod: formatPaymentMethod(payload.p_payment_method),
    orderDate,
    deliveryOptions: formatDeliveryOption(payload.p_delivery_option),
    deliveryAddress: formatDeliveryAddress(payload.p_delivery_address),
    contactNumber: payload.p_phone,
  }
})
</script>

<template>
  <div class="order-confirmation-page">
    <div class="app-container">
      <div class="order-confirmation-page__toast">
        <Toast type="success">
          <Icon name="circle-checkmark" />
          <p class="toast__text">We’ve received your order</p>
        </Toast>
      </div>
      <div class="order-confirmation-page__body">
        <div class="order-confirmation-page__billing-details">
          <h2 class="order-confirmation-page__billing-details-title h2-title">Order Details</h2>
          <OrderDetails
            :order-number="orderDetailsProps.orderNumber"
            :email="orderDetailsProps.email"
            :payment-method="orderDetailsProps.paymentMethod"
            :order-date="orderDetailsProps.orderDate"
            :delivery-options="orderDetailsProps.deliveryOptions"
            :delivery-address="orderDetailsProps.deliveryAddress"
            :contact-number="orderDetailsProps.contactNumber"
          />
        </div>
        <div class="order-confirmation-page__order">
          <h2 class="order-confirmation-page__order-title h2-title">Order Summary</h2>
          <CheckoutTotals
            :subtotal="orderSummaryForTotals.subtotal"
            :shipping-cost="orderSummaryForTotals.shippingCost"
            :total="orderSummaryForTotals.total"
            :line-items="orderSummaryForTotals.lineItems"
            :show-bottom="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-confirmation-page {
  $breakpoint-md: 1024px;

  font-family: var(--font-family);
  padding-top: globalFunctions.fluidValue(24px, 96px, 320px, 1440px);

  .h2-title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(21px, 26px, 320px, 1440px);
  }

  &__toast {
    margin-bottom: globalFunctions.fluidValue(24px, 96px, 320px, 1440px);
  }

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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: globalFunctions.fluidValue(39px, 90px, 320px, 1440px);

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
