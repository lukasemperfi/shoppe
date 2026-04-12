<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/shared/ui/button/Button.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Radio from '@/shared/ui/radio/Radio.vue'

export interface CheckoutTotalsLineItem {
  id: string
  name: string
  lineTotal: number
}

const props = withDefaults(
  defineProps<{
    subtotal: number
    total?: number
    lineItems: CheckoutTotalsLineItem[]
    shippingLabel?: string
  }>(),
  {
    total: undefined,
    shippingLabel: 'Free shipping',
  },
)

const emit = defineEmits<{
  checkout: []
}>()

const displayTotal = computed(() =>
  props.total !== undefined && props.total !== null ? props.total : props.subtotal,
)

type PaymentMethod = 'direct_bank' | 'check' | 'cash_on_delivery' | 'paypal'

const selectedPayment = ref<PaymentMethod>('direct_bank')

const paymentOptions: {
  value: PaymentMethod
  label: string
  description: string
  descId: string
  showPayPalIcon?: boolean
}[] = [
  {
    value: 'direct_bank',
    label: 'Direct bank transfer',
    descId: 'checkout-payment-desc-direct_bank',
    description:
      'Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account',
  },
  {
    value: 'check',
    label: 'Check payments',
    descId: 'checkout-payment-desc-check',
    description:
      'Please mail your check to the address on your order confirmation. We will ship your order after the check has cleared, which may take several business days.',
  },
  {
    value: 'cash_on_delivery',
    label: 'Cash on delivery',
    descId: 'checkout-payment-desc-cash_on_delivery',
    description:
      'Pay with cash when your order is delivered. Please have the exact amount ready for the courier. Additional COD fees may apply depending on your location.',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    descId: 'checkout-payment-desc-paypal',
    description:
      'You will be redirected to PayPal to complete your payment securely. You can pay with your PayPal balance or linked card without sharing your financial details with us.',
    showPayPalIcon: true,
  },
]

function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100
  if (Number.isInteger(rounded)) {
    return `$${rounded}`
  }
  return `$${rounded.toFixed(2)}`
}

function onCheckout() {
  emit('checkout')
}
</script>

<template>
  <section class="checkout-totals" aria-labelledby="checkout-totals-title">
    <div class="checkout-totals__summary">
      <div class="checkout-totals__row checkout-totals__row_head">
        <span class="checkout-totals__table-head-label">Product</span>
        <span class="checkout-totals__table-head-label">Total</span>
      </div>

      <div class="checkout-totals__row">
        <ul class="checkout-totals__lines" role="list">
          <li
            v-for="item in lineItems"
            :key="item.id"
            class="checkout-totals__line"
            role="listitem"
          >
            <span class="checkout-totals__line-name">{{ item.name }}</span>
            <span class="checkout-totals__line-price">{{ formatPrice(item.lineTotal) }}</span>
          </li>
        </ul>
      </div>

      <div class="checkout-totals__row">
        <span class="checkout-totals__label">Subtotal</span>
        <span class="checkout-totals__value_muted">{{ formatPrice(subtotal) }}</span>
      </div>

      <div class="checkout-totals__row">
        <span class="checkout-totals__label">Shipping</span>
        <span class="checkout-totals__value_muted">{{ shippingLabel }}</span>
      </div>

      <div class="checkout-totals__row checkout-totals__row_total">
        <span class="checkout-totals__label">Total</span>
        <span class="checkout-totals__value_total">{{ formatPrice(displayTotal) }}</span>
      </div>
    </div>

    <fieldset class="checkout-totals__payments">
      <legend class="checkout-totals__payments-legend">Payment method</legend>

      <div
        v-for="option in paymentOptions"
        :key="option.value"
        class="checkout-totals__payment-block"
      >
        <div
          class="checkout-totals__payment-line"
          :class="{ 'checkout-totals__payment-line_paypal': option.showPayPalIcon }"
        >
          <Radio
            v-model="selectedPayment"
            name="checkout-payment"
            :value="option.value"
            :label="option.label"
            :aria-describedby="selectedPayment === option.value ? option.descId : undefined"
          />
          <Icon
            v-if="option.showPayPalIcon"
            class="checkout-totals__paypal-icon"
            name="pay-pal"
            aria-hidden="true"
          />
        </div>
        <p
          v-if="selectedPayment === option.value"
          :id="option.descId"
          class="checkout-totals__payment-desc"
        >
          {{ option.description }}
        </p>
      </div>
    </fieldset>

    <Button
      type="button"
      variant="primary"
      color="black"
      class="checkout-totals__place-order full"
      aria-label="Place order"
      @click="onCheckout"
    >
      Place order
    </Button>
  </section>
</template>

<style scoped lang="scss">
.checkout-totals {
  $layout-min: 320px;
  $layout-max: 1440px;

  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--light-colors-light-gray---light, #efefef);
  font-family: var(--font-family);
  padding-inline: globalFunctions.fluidValue(16px, 59px, $layout-min, $layout-max);
  padding-block: globalFunctions.fluidValue(16px, 39px, $layout-min, $layout-max);
  border-radius: 0;

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    border-radius: 4px;
  }

  &__title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__summary {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 19px;
  }

  &__table-head {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);
  }

  &__table-head-label {
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    text-transform: uppercase;
    letter-spacing: 0.02em;

    &:last-child {
      text-align: right;
    }
  }

  &__divider {
    width: 100%;
    height: 0;
    margin-block: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    border: 0;
    border-top: 1px solid var(--light-colors-gray---light, #d8d8d8);
  }

  &__lines {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 26px;
    width: 100%;
  }

  &__line {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    column-gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);
  }

  &__line-name,
  &__line-price {
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light, #707070);
  }

  &__line-price {
    text-align: right;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);
    border-bottom: 1px solid var(--light-colors-gray---light, #d8d8d8);
    padding-bottom: 10px;

    &_head {
      padding-bottom: 18px;
    }
  }

  &__label {
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  &__value_muted {
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light, #707070);
    text-align: right;
  }

  &__row_total {
    .checkout-totals__label,
    .checkout-totals__value_total {
      font-weight: 700;
      font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
      line-height: globalFunctions.fluidValue(20px, 21px, $layout-min, $layout-max);
      color: var(--light-colors-black---light);
    }

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      .checkout-totals__label,
      .checkout-totals__value_total {
        font-weight: 400;
      }
    }
  }

  &__value_total {
    text-align: right;
    text-transform: capitalize;
  }

  &__payments {
    margin: 0;
    margin-top: globalFunctions.fluidValue(24px, 48px, $layout-min, $layout-max);
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(12px, 20px, $layout-min, $layout-max);

    :deep(.radio) {
      gap: globalFunctions.fluidValue(8px, 12px, $layout-min, $layout-max);
    }

    :deep(.radio__label) {
      font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
      line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    }
  }

  &__payments-legend {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__payment-block {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(10px, 19px, $layout-min, $layout-max);
  }

  &__payment-line {
    display: flex;
    align-items: flex-start;
    width: 100%;

    &_paypal {
      align-items: center;
      gap: 8px;
    }
  }

  &__payment-desc {
    margin: 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: var(--light-colors-dark-gray---light, #707070);
  }

  &__place-order {
    margin-top: globalFunctions.fluidValue(20px, 32px, $layout-min, $layout-max);
    width: 100%;
  }

  :deep(.checkout-totals__place-order.btn) {
    width: 100%;
    min-height: globalFunctions.fluidValue(32px, 53px, $layout-min, $layout-max);
    padding-block: globalFunctions.fluidValue(6px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 21px, $layout-min, $layout-max);
    border-radius: 4px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }
}
</style>
