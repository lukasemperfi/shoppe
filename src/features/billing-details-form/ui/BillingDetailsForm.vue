<script setup lang="ts">
import { useField } from 'vee-validate'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'
import Select from '@/shared/ui/select/Select.vue'

type SelectOption = { label: string; value: string | number }

interface Props {
  countryOptions: SelectOption[]
  countryId?: string
  showCheckboxes?: boolean
  showOrderNotes?: boolean
  showSubmit?: boolean
  submitLabel?: string
  formAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  countryId: 'billing-details-country',
  showCheckboxes: true,
  showOrderNotes: true,
  showSubmit: false,
  submitLabel: 'Save address',
  formAriaLabel: 'Billing details form',
})

const emit = defineEmits<{ (e: 'submit'): void }>()

const { value: firstName, errorMessage: firstNameError } = useField<string>('first_name')
const { value: lastName, errorMessage: lastNameError } = useField<string>('last_name')
const { value: companyName, errorMessage: companyNameError } = useField<string>('company_name')
const { value: country, errorMessage: countryError } = useField<string | number>('country')
const { value: streetAddress, errorMessage: streetAddressError } = useField<string>('street_address')
const { value: postCode, errorMessage: postCodeError } = useField<string>('post_code')
const { value: city, errorMessage: cityError } = useField<string>('city')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: email, errorMessage: emailError } = useField<string>('email')

const orderNotesField = props.showOrderNotes
  ? useField<string>('order_notes')
  : null

function onSubmit() {
  emit('submit')
}
</script>

<template>
  <div class="billing-details-form" :aria-label="props.formAriaLabel">
    <div class="billing-details-form__item billing-details-form__item_first-name">
      <Input
        class="billing-details-form__input"
        placeholder="First Name *"
        name="first_name"
        v-model="firstName"
        :error-message="firstNameError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_last-name">
      <Input
        class="billing-details-form__input"
        placeholder="Last Name *"
        name="last_name"
        v-model="lastName"
        :error-message="lastNameError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_company-name">
      <Input
        class="billing-details-form__input"
        placeholder="Company Name"
        name="company_name"
        v-model="companyName"
        :error-message="companyNameError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_country">
      <Select
        :options="props.countryOptions"
        :id="props.countryId"
        v-model="country"
        name="country"
        placeholder="Country *"
        class="billing-details-form__select"
        :error-message="countryError"
        :error-id="`${props.countryId}-error`"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_street-address">
      <Input
        class="billing-details-form__input"
        placeholder="Street Address *"
        name="street_address"
        v-model="streetAddress"
        :error-message="streetAddressError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_postcode-zip">
      <Input
        class="billing-details-form__input"
        placeholder="Postcode / ZIP *"
        name="post_code"
        v-model="postCode"
        :error-message="postCodeError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_town-city">
      <Input
        class="billing-details-form__input"
        placeholder="Town / City *"
        name="city"
        v-model="city"
        :error-message="cityError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_phone">
      <Input
        class="billing-details-form__input"
        placeholder="Phone *"
        name="phone"
        v-model="phone"
        :error-message="phoneError"
      />
    </div>

    <div class="billing-details-form__item billing-details-form__item_email">
      <Input
        class="billing-details-form__input"
        placeholder="Email *"
        name="email"
        v-model="email"
        :error-message="emailError"
      />
    </div>

    <div v-if="props.showCheckboxes" class="billing-details-form__item billing-details-form__item_checkboxes">
      <Checkbox label="Create an account?" class="billing-details-form__checkbox" />
      <Checkbox label="Ship to a different address?" class="billing-details-form__checkbox" />
    </div>

    <div
      v-if="props.showOrderNotes && orderNotesField"
      class="billing-details-form__item billing-details-form__item_order-notes"
    >
      <Input
        class="billing-details-form__input"
        placeholder="Order Notes"
        name="order_notes"
        v-model="orderNotesField.value.value"
        :error-message="orderNotesField.errorMessage.value"
      />
    </div>

    <div v-if="props.showSubmit" class="billing-details-form__actions">
      <slot name="actions">
        <Button variant="primary" class="billing-details-form__submit" type="button" @click="onSubmit">
          {{ props.submitLabel }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.billing-details-form {
  $breakpoint-md: 1024px;

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

  &__actions {
    grid-column: 1 / -1;
    margin-top: globalFunctions.fluidValue(6px, 18px, 320px, 1440px);
  }

  &__submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
