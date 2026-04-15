<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import BillingDetailsForm from '@/features/billing-details-form/ui/BillingDetailsForm.vue'
import { profileAddressSchema } from '@/entities/user/model/validation'
import type { Address } from '@/entities/user/model/types'
import Button from '@/shared/ui/button/Button.vue'

type FormValues = {
  first_name: string
  last_name: string
  company_name?: string
  country: string | number
  street_address: string
  post_code: string
  city: string
  phone: string
  email: string
}

type SelectOption = { label: string; value: string | number }

interface Props {
  countryOptions: SelectOption[]
  address: Address | null
  submitLabel?: string
  formAriaLabel: string
  countryId: string
  isSaving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'SAVE ADDRESS',
  isSaving: false,
})

const emit = defineEmits<{ (e: 'save', values: FormValues): void }>()

function mapAddressToValues(a: Address | null): FormValues {
  return {
    first_name: a?.first_name ?? '',
    last_name: a?.last_name ?? '',
    company_name: a?.company_name ?? '',
    country: a?.country ?? '',
    street_address: a?.street_address ?? '',
    post_code: a?.post_code ?? '',
    city: a?.city ?? '',
    phone: a?.phone ?? '',
    email: a?.email ?? '',
  }
}

const { handleSubmit, resetForm } = useForm<FormValues>({
  validationSchema: profileAddressSchema,
  initialValues: mapAddressToValues(props.address),
})

watch(
  () => props.address,
  (next) => {
    resetForm({ values: mapAddressToValues(next) })
  },
)

const onSave = handleSubmit(async (values) => {
  emit('save', values)
})
</script>

<template>
  <div class="address-form-section">
    <form
      class="address-form-section__form"
      :aria-label="props.formAriaLabel"
      :aria-busy="props.isSaving ? 'true' : 'false'"
      @submit.prevent="onSave"
    >
      <BillingDetailsForm
        class="address-form-section__fields"
        :country-options="props.countryOptions"
        :country-id="props.countryId"
        :show-checkboxes="false"
        :show-order-notes="false"
        :show-submit="true"
        @submit="onSave"
      >
        <template #actions>
          <Button
            variant="primary"
            class="address-form-section__submit"
            type="button"
            :disabled="props.isSaving"
            @click="onSave"
          >
            <span v-if="props.isSaving" class="address-form-section__spinner" aria-hidden="true" />
            <span class="address-form-section__submit-label">
              {{ props.isSaving ? 'Saving...' : props.submitLabel }}
            </span>
          </Button>
        </template>
      </BillingDetailsForm>
    </form>
  </div>
</template>

<style scoped lang="scss">
.address-form-section {
  &__submit {
    width: 100%;
    justify-content: center;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__spinner {
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.45);
    border-top-color: rgba(255, 255, 255, 1);
    border-radius: 50%;
    animation: address-form-section-spin 0.75s linear infinite;
  }

  :deep(.billing-details-form__actions) {
    grid-column: 1;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      grid-column: 1 / -1;
    }
  }
}

@keyframes address-form-section-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
