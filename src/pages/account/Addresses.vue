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
    <div class="app-container">
      <div class="address-page__description">
        <p class="address-page__description-text">We’ve received your order</p>
      </div>
      <div class="address-page__body">
        <div class="address-page__billing-details">
          <form
            class="address-page__form"
            aria-label="Addresses content"
            @submit.prevent="onSubmit"
          >
            <h2 class="address-page__billing-details-title h2-title">Order Details</h2>
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
          <h2 class="address-page__order-title h2-title">Order Summary</h2>
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
}
</style>
