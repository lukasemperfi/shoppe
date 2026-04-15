<script setup lang="ts">
import { useForm } from 'vee-validate'
import BillingDetailsForm from '@/features/billing-details-form/ui/BillingDetailsForm.vue'
import { profileAddressSchema } from '@/entities/address/model/validation'
import { countryOptions } from '@/entities/address/model/constants'

const { handleSubmit, resetForm } = useForm<{
  first_name: string
  last_name: string
  company_name?: string
  country: string | number
  street_address: string
  post_code: string
  city: string
  phone: string
  email: string
}>({
  validationSchema: profileAddressSchema,
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
  },
})

const saveAddress = handleSubmit(async (_values) => {
  resetForm()
})

function onSubmit() {
  return saveAddress()
}
</script>

<template>
  <div class="address-page">
    <div class="address-page__description">
      The following addresses will be used on the checkout page by default.
    </div>
    <div class="address-page__body">
      <div class="address-page__billing-details">
        <form class="address-page__form" aria-label="Addresses content" @submit.prevent="onSubmit">
          <h2 class="address-page__billing-details-title h2-title">Billing Address</h2>
          <BillingDetailsForm
            class="address-page__form"
            :country-options="countryOptions"
            :show-checkboxes="false"
            :show-order-notes="false"
            :show-submit="true"
            submit-label="SAVE ADDRESS"
          />
        </form>
      </div>
      <div class="address-page__order">
        <h2 class="address-page__order-title h2-title">Shipping Address</h2>
        <div class="address-page__add-item add-item">
          <button class="add-item__button">Add</button>
          <div class="add-item__text">You have not set up this type of address yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-page {
  $breakpoint-md: 1024px;

  font-family: var(--font-family);

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

  &__form {
    &__title {
      margin: 0 0 globalFunctions.fluidValue(18px, 28px, 320px, 1440px);
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
      color: var(--light-colors-black---light);
    }

    &__form {
      max-width: 680px;
    }
  }
  &__description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(24px, 45px, 320px, 1440px);
  }

  .add-item {
    display: flex;
    flex-direction: column;
    gap: 14px;

    &__button {
      font-family: var(--font-family);
      font-weight: 700;
      font-size: 16px;
      color: var(--light-colors-accent---light);
      text-transform: uppercase;
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
    }
  }
}
</style>
