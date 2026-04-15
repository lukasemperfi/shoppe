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
  <form class="account-addresses" aria-label="Addresses content" @submit.prevent="onSubmit">
    <h2 class="account-addresses__title">Billing address</h2>

    <BillingDetailsForm
      class="account-addresses__form"
      :country-options="countryOptions"
      :show-checkboxes="false"
      :show-order-notes="false"
      :show-submit="true"
      submit-label="SAVE ADDRESS"
    />
  </form>
</template>

<style scoped lang="scss">
.account-addresses {
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
</style>
