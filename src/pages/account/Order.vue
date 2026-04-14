<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { OrderAddressPayload, Order } from '@/entities/order/model/types'
import { orderApi } from '@/entities/order/api/order'
import { useAuthStore } from '@/entities/auth/model/auth.store'
import CheckoutTotals, { type CheckoutTotalsLineItem } from '@/pages/checkout/ui/CheckoutTotals.vue'
import OrderDetails from '@/pages/order-confirmation/ui/OrderDetails.vue'
import Loader from '@/shared/ui/loader/Loader.vue'

const route = useRoute()
const authStore = useAuthStore()

const order = ref<Order | null>(null)
const isLoading = ref(false)

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
  const o = order.value
  if (!o) {
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

  const orderDate = new Date(o.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return {
    orderNumber: String(o.order_number),
    email: o.email,
    paymentMethod: formatPaymentMethod(o.payment_method),
    orderDate,
    deliveryOptions: formatDeliveryOption(o.delivery_option),
    deliveryAddress: formatDeliveryAddress(o.delivery_address),
    contactNumber: o.phone,
  }
})

const orderSummaryForTotals = computed(() => {
  const o = order.value
  if (!o?.order_items?.length) {
    return {
      subtotal: 0,
      shippingCost: o?.shipping_cost ?? 0,
      total: o?.total_sum ?? 0,
      lineItems: [] as CheckoutTotalsLineItem[],
    }
  }

  const lineItems: CheckoutTotalsLineItem[] = o.order_items.map((item, index) => ({
    id: `${item.product_id}-${index}`,
    name: item.products?.name ?? 'Product',
    lineTotal: item.price_at_purchase * item.quantity,
  }))

  const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0)

  return {
    subtotal,
    shippingCost: o.shipping_cost,
    total: o.total_sum,
    lineItems,
  }
})

async function loadOrder() {
  const rawId = route.params.id
  const orderId = Array.isArray(rawId) ? rawId[0] : rawId
  const userId = authStore.user?.id

  if (!orderId || !userId) {
    order.value = null
    return
  }

  isLoading.value = true
  try {
    order.value = await orderApi.getOrderById(orderId, userId)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadOrder()
})

watch(
  () => route.params.id,
  async () => {
    await loadOrder()
  },
)
</script>

<template>
  <div class="order-page">
    <div class="app-container">
      <div v-if="isLoading" class="order-page__loading" aria-live="polite" aria-busy="true">
        <Loader />
      </div>

      <div v-else-if="order" class="order-page__body">
        <div class="order-page__billing-details">
          <h2 class="order-page__billing-details-title h2-title">Order Details</h2>
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
        <div class="order-page__order">
          <h2 class="order-page__order-title h2-title">Order Summary</h2>
          <CheckoutTotals
            :subtotal="orderSummaryForTotals.subtotal"
            :shipping-cost="orderSummaryForTotals.shippingCost"
            :total="orderSummaryForTotals.total"
            :line-items="orderSummaryForTotals.lineItems"
            :show-bottom="false"
          />
        </div>
      </div>

      <p v-else class="order-page__empty" role="status">This order could not be loaded.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-page {
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

  &__loading {
    display: flex;
    justify-content: center;
    padding: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
  }

  &__empty {
    margin: 0;
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light, #707070);
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

  :deep(.checkout-totals__row_total) {
    border-bottom: none;
  }
}
</style>
