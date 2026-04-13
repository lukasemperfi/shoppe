<script setup lang="ts">
import { computed } from 'vue'
import { mapViewItemToCartItem, useCartStore } from '@/entities/cart'
import CartItemCard from '@/pages/cart/ui/CartItemCard.vue'
import CartTotals from '@/pages/cart/ui/CartTotals.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import Select from '@/shared/ui/select/Select.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import CheckoutTotals from './ui/CheckoutTotals.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

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

const selectRequired = (message: string) =>
  yup
    .mixed<string | number>()
    .test('required', message, (value) => value !== '' && value !== null && value !== undefined)

const nameLikeRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u
const cityLikeRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u
const postCodeRegex = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,18}[A-Za-z0-9]$/
const phoneAllowedCharsRegex = /^[0-9+\s().-]+$/

const validationSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name must be at most 50 characters')
    .matches(nameLikeRegex, 'First Name contains invalid characters')
    .required('First Name is required'),
  last_name: yup
    .string()
    .trim()
    .min(2, 'Last Name must be at least 2 characters')
    .max(50, 'Last Name must be at most 50 characters')
    .matches(nameLikeRegex, 'Last Name contains invalid characters')
    .required('Last Name is required'),
  company_name: yup.string().trim().max(80, 'Company Name must be at most 80 characters').default('').optional(),
  country: selectRequired('Country is required'),
  street_address: yup
    .string()
    .trim()
    .min(5, 'Street Address must be at least 5 characters')
    .max(120, 'Street Address must be at most 120 characters')
    .required('Street Address is required'),
  post_code: yup
    .string()
    .trim()
    .min(3, 'Postcode / ZIP must be at least 3 characters')
    .max(20, 'Postcode / ZIP must be at most 20 characters')
    .matches(postCodeRegex, 'Postcode / ZIP has invalid format')
    .required('Postcode / ZIP is required'),
  city: yup
    .string()
    .trim()
    .min(2, 'Town / City must be at least 2 characters')
    .max(60, 'Town / City must be at most 60 characters')
    .matches(cityLikeRegex, 'Town / City contains invalid characters')
    .required('Town / City is required'),
  phone: yup
    .string()
    .trim()
    .matches(phoneAllowedCharsRegex, 'Phone contains invalid characters')
    .test('min-digits', 'Phone must contain at least 10 digits', (value) => {
      const digits = String(value ?? '').replace(/\D/g, '')
      return digits.length >= 10
    })
    .max(25, 'Phone must be at most 25 characters')
    .required('Phone is required'),
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  order_notes: yup.string().trim().max(500, 'Order Notes must be at most 500 characters').default('').optional(),
})

const { defineField, errors, handleSubmit, submitCount } = useForm<{
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
  validationSchema,
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

const [firstName, firstNameAttrs] = defineField('first_name')
const [lastName, lastNameAttrs] = defineField('last_name')
const [companyName, companyNameAttrs] = defineField('company_name')
const [country] = defineField('country')
const [streetAddress, streetAddressAttrs] = defineField('street_address')
const [postCode, postCodeAttrs] = defineField('post_code')
const [city, cityAttrs] = defineField('city')
const [phone, phoneAttrs] = defineField('phone')
const [email, emailAttrs] = defineField('email')
const [orderNotes, orderNotesAttrs] = defineField('order_notes')

const onCheckout = handleSubmit(async (values) => {
  // TODO: интеграция реальной отправки заказа
  // Сейчас условие задачи: отправка только когда валидация ok
  // eslint-disable-next-line no-console
  console.log('Checkout payload', values)
})
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
                v-model="firstName"
                v-bind="firstNameAttrs"
                :error-message="submitCount > 0 ? errors.first_name : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_last-name">
              <Input
                class="billing-details-form__input"
                placeholder="Last Name *"
                name="last_name"
                v-model="lastName"
                v-bind="lastNameAttrs"
                :error-message="submitCount > 0 ? errors.last_name : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_company-name">
              <Input
                class="billing-details-form__input"
                placeholder="Company Name"
                name="company_name"
                v-model="companyName"
                v-bind="companyNameAttrs"
                :error-message="submitCount > 0 ? errors.company_name : undefined"
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
                :error-message="submitCount > 0 ? errors.country : undefined"
                error-id="billing-details-country-error"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_street-address">
              <Input
                class="billing-details-form__input"
                placeholder="Street Address *"
                name="street_address"
                v-model="streetAddress"
                v-bind="streetAddressAttrs"
                :error-message="submitCount > 0 ? errors.street_address : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_postcode-zip">
              <Input
                class="billing-details-form__input"
                placeholder="Postcode / ZIP *"
                name="post_code"
                v-model="postCode"
                v-bind="postCodeAttrs"
                :error-message="submitCount > 0 ? errors.post_code : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_town-city">
              <Input
                class="billing-details-form__input"
                placeholder="Town / City *"
                name="city"
                v-model="city"
                v-bind="cityAttrs"
                :error-message="submitCount > 0 ? errors.city : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_phone">
              <Input
                class="billing-details-form__input"
                placeholder="Phone *"
                name="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                :error-message="submitCount > 0 ? errors.phone : undefined"
              />
            </div>
            <div class="billing-details-form__item billing-details-form__item_email">
              <Input
                class="billing-details-form__input"
                placeholder="Email *"
                name="email"
                v-model="email"
                v-bind="emailAttrs"
                :error-message="submitCount > 0 ? errors.email : undefined"
              />
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
                v-model="orderNotes"
                v-bind="orderNotesAttrs"
                :error-message="submitCount > 0 ? errors.order_notes : undefined"
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

  .billing-details-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
    row-gap: globalFunctions.fluidValue(22px, 36px, 320px, 1440px);

    &__item {
      position: relative;
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

    &__field-error {
      margin: 0;
      font-size: 10px;
      color: var(--light-colors-errors---light);
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
}
</style>
