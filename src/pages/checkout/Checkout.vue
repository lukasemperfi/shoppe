<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapViewItemToCartItem, useCartStore } from '@/entities/cart'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'
import CartTotals from '@/pages/cart/ui/CartTotals.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import CheckoutTotals from './ui/CheckoutTotals.vue'
import BillingDetailsForm from '@/features/billing-details-form/ui/BillingDetailsForm.vue'
import { useForm } from 'vee-validate'
import { checkoutAddressSchema } from '@/entities/address/model/validation'
import { countryOptions } from '@/entities/address/model/constants'
import { orderApi } from '@/entities/order/api/order'
import type { CreateOrderRPCParams } from '@/entities/order/model/types'
import { pinia } from '@/app/providers/pinia'
import { useCheckoutFlowStore } from '@/features/checkout-flow/model/checkout-flow.store'
import { useAuthStore } from '@/entities/auth/model/auth.store'

const cart = useCartStore()
const router = useRouter()
const flow = useCheckoutFlowStore(pinia)
const authStore = useAuthStore()
const cartSubtotal = computed(() => cart.subtotal)
const cartShippingCost = computed(() => cart.shippingCost)
const cartTotal = computed(() => cart.totalSum)

const checkoutLineItems = computed(() =>
  cart.viewItems.map((v) => ({
    id: v.cartItemId,
    name: v.product.name,
    lineTotal: v.unitPrice * v.quantity,
  })),
)

function removeItem(cartItemId: string) {
  cart.removeItem(cartItemId)
}

async function onRefreshCart() {
  await cart.refreshViewItems()
}

const { handleSubmit, submitCount, resetForm } = useForm<{
  first_name: string
  last_name: string
  company_name?: string
  country: string | number
  street_address: string
  post_code: string
  city: string
  phone: string
  email: string
  order_notes?: string
}>({
  validationSchema: checkoutAddressSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    company_name: '',
    country: '',
    street_address: '',
    post_code: '',
    city: '',
    phone: '',
    email: '',
    order_notes: '',
  },
})

const checkoutMeta = ref<{ paymentMethod: string; deliveryOption: string } | null>(null)

const submitCheckout = handleSubmit(async (values) => {
  if (cart.viewItems.length === 0) return
  if (!checkoutMeta.value) return

  const { paymentMethod, deliveryOption } = checkoutMeta.value

  const payload: CreateOrderRPCParams = {
    p_email: values.email,
    p_phone: values.phone,
    p_payment_method: paymentMethod,
    p_delivery_option: deliveryOption,
    p_delivery_address: {
      first_name: values.first_name,
      last_name: values.last_name,
      company_name: values.company_name || undefined,
      country: String(values.country),
      street_address: values.street_address,
      post_code: values.post_code,
      city: values.city,
      phone: values.phone,
      email: values.email,
    },
    p_shipping_cost: cartShippingCost.value,
    p_total_sum: cartTotal.value,
    p_items: cart.viewItems.map((v) => ({
      product_id: v.productId,
      quantity: v.quantity,
      price_at_purchase: v.unitPrice,
    })),
    p_user_id: authStore.user?.id,
  }

  const orderId = await orderApi.createOrder(payload)
  flow.setOrderConfirmation({
    orderId,
    payload,
    summaryLineItems: cart.viewItems.map((v) => ({
      id: v.cartItemId,
      name: v.product.name,
      lineTotal: v.unitPrice * v.quantity,
    })),
  })
  cart.clearCart()
  checkoutMeta.value = null
  resetForm()
  flow.clearCheckoutAccess()
  router.push({ name: 'order-confirmation' })
})

function onCheckout(meta: { paymentMethod: string; deliveryOption: string }) {
  checkoutMeta.value = meta
  return submitCheckout()
}
</script>

<template>
  <div class="cart-page">
    <div class="app-container">
      <h1 class="cart-page__title">Checkout</h1>
      <div class="cart-page__body">
        <div class="cart-page__top">
          <div class="cart-page__top-item">
            Returning customer?<RouterLink to="/login" class="cart-page__go-to-login link-text"
              >Click here to login</RouterLink
            >
          </div>
          <div class="cart-page__top-item">
            Have a coupon?<button class="cart-page__go-to-coupon link-text">
              Click here to enter your code
            </button>
          </div>
          <div class="cart-page__coupon">
            <div class="cart-page__coupon-description">
              If you have a coupon code, please apply it below.
            </div>
            <div class="coupon">
              <Input class="coupon__input" placeholder="Coupon Code" />
              <Button variant="primary" class="coupon__button">Apply Coupon</Button>
            </div>
          </div>
        </div>
        <div class="cart-page__billing-details">
          <h2 class="cart-page__billing-details-title h2-title">Billing Details</h2>
          <BillingDetailsForm
            class="cart-page__billing-details-form"
            :country-options="countryOptions"
          />
        </div>
        <div class="cart-page__order">
          <h2 class="cart-page__order-title h2-title">Your Order</h2>
          <CheckoutTotals
            :subtotal="cartSubtotal"
            :shipping-cost="cartShippingCost"
            :total="cartTotal"
            :line-items="checkoutLineItems"
            @checkout="onCheckout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
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

  &__top {
    grid-column: 1;

    @media (max-width: $breakpoint-md) {
      grid-column: auto;
    }

    &-item {
      display: flex;
      gap: 4px;
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
      margin-bottom: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);

      &:nth-child(2) {
        margin-bottom: 0;
      }
    }
  }

  .link-text {
    color: var(--light-colors-black---light);
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  }

  &__coupon {
    border: 1px solid var(--light-colors-gray---light);
    padding: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);
    padding-bottom: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
    margin-top: globalFunctions.fluidValue(16px, 28px, 320px, 1440px);

    @media (max-width: $breakpoint-md) {
      border: none;
      padding: 0;
    }

    &-description {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
      margin-bottom: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
    }
  }

  &__billing-details {
    grid-column: 1;

    @media (max-width: $breakpoint-md) {
      grid-column: auto;
    }
  }

  &__order {
    grid-column: 2;

    @media (max-width: $breakpoint-md) {
      grid-column: auto;
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

}
</style>
