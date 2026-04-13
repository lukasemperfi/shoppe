<script setup lang="ts">
import { computed, ref } from 'vue'
import { mapViewItemToCartItem, useCartStore } from '@/entities/cart'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'
import CartTotals from '@/pages/cart/ui/CartTotals.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Select from '@/shared/ui/select/Select.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import CheckoutTotals from './ui/CheckoutTotals.vue'

const cart = useCartStore()

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

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
]

const country = ref('')
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
          <form class="cart-page__billing-details-form billing-details-form">
            <div class="billing-details-form__item billing-details-form__item_first-name">
              <Input
                class="billing-details-form__input"
                placeholder="First Name *"
                name="first_name"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_last-name">
              <Input
                class="billing-details-form__input"
                placeholder="Last Name *"
                name="last_name"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_company-name">
              <Input
                class="billing-details-form__input"
                placeholder="Company Name"
                name="company_name"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_country">
              <Select
                :options="countryOptions"
                id="billing-details-country"
                v-model="country"
                name="country"
                placeholder="Country *"
                class="billing-details-form__select"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_street-address">
              <Input
                class="billing-details-form__input"
                placeholder="Street Address *"
                name="street_address"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_postcode-zip">
              <Input
                class="billing-details-form__input"
                placeholder="Postcode / ZIP *"
                name="post_code"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_town-city">
              <Input class="billing-details-form__input" placeholder="Town / City *" name="city" />
            </div>
            <div class="billing-details-form__item billing-details-form__item_phone">
              <Input class="billing-details-form__input" placeholder="Phone *" name="phone" />
            </div>
            <div class="billing-details-form__item billing-details-form__item_email">
              <Input class="billing-details-form__input" placeholder="Email *" name="email" />
            </div>
            <div class="billing-details-form__item billing-details-form__item_checkboxes">
              <Checkbox label="Create an account?" class="billing-details-form__checkbox" />
              <Checkbox
                label="Ship to a different address?"
                class="billing-details-form__checkbox"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_order-notes">
              <Input
                class="billing-details-form__input"
                placeholder="Order Notes"
                name="order_notes"
              />
            </div>
          </form>
        </div>
        <div class="cart-page__order">
          <h2 class="cart-page__order-title h2-title">Your Order</h2>
          <CheckoutTotals
            :subtotal="cartSubtotal"
            :shipping-cost="cartShippingCost"
            :total="cartTotal"
            :line-items="checkoutLineItems"
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

  .billing-details-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
    row-gap: globalFunctions.fluidValue(22px, 36px, 320px, 1440px);

    &__item {
      &_first-name {
        grid-column: 1;

        @media (max-width: $breakpoint-md) {
          grid-column: 1 / -1;
        }
      }
      &_last-name {
        grid-column: 2;

        @media (max-width: $breakpoint-md) {
          grid-column: 1 / -1;
        }
      }

      &_company-name,
      &_country,
      &_street-address,
      &_postcode-zip,
      &_town-city,
      &_phone,
      &_email,
      &_order-notes {
        grid-column: 1 / -1;
      }

      &_checkboxes {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        gap: globalFunctions.fluidValue(12px, 25px, 320px, 1440px);

        :deep(.checkbox) {
          .checkbox__box {
            width: 16px;
            height: 16px;
          }
          .checkbox__label {
            font-family: var(--font-family);
            font-weight: 400;
            font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
            color: var(--light-colors-black---light);
          }
        }
      }
    }
  }
}
</style>
