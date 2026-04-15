<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import Input from '@/shared/ui/input/Input.vue'
import Button from '@/shared/ui/button/Button.vue'
import { accountDetailsSchemaWithRules } from '@/entities/user/model/account-details.validation'

export type AccountDetailsFormValues = {
  first_name: string
  last_name: string
  display_name: string
  email: string
  current_password: string
  new_password: string
  confirm_new_password: string
}

type ExternalErrors = Partial<Record<keyof AccountDetailsFormValues, string>>

interface Props {
  initialValues: AccountDetailsFormValues
  isLoading?: boolean
  isSaving?: boolean
  isDisabled?: boolean
  submitLabel?: string
  externalErrors?: ExternalErrors
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isSaving: false,
  isDisabled: false,
  submitLabel: 'SAVE CHANGES',
  externalErrors: undefined,
})

const emit = defineEmits<{
  (e: 'submit', values: AccountDetailsFormValues): void
}>()

const { defineField, errors, handleSubmit, resetForm, setFieldError } = useForm<AccountDetailsFormValues>({
  validationSchema: accountDetailsSchemaWithRules,
  initialValues: props.initialValues,
})

const [firstName, firstNameAttrs] = defineField('first_name')
const [lastName, lastNameAttrs] = defineField('last_name')
const [displayName, displayNameAttrs] = defineField('display_name')
const [email, emailAttrs] = defineField('email')
const [currentPassword, currentPasswordAttrs] = defineField('current_password')
const [newPassword, newPasswordAttrs] = defineField('new_password')
const [confirmNewPassword, confirmNewPasswordAttrs] = defineField('confirm_new_password')

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values)
})

watch(
  () => props.initialValues,
  (next) => resetForm({ values: next }),
  { deep: true },
)

watch(
  () => props.externalErrors,
  (errs) => {
    if (!errs) return
    for (const [k, message] of Object.entries(errs)) {
      if (!message) continue
      setFieldError(k as keyof AccountDetailsFormValues, message)
    }
  },
  { deep: true },
)
</script>

<template>
  <form
    class="account-details-form"
    aria-label="Account details form"
    :aria-busy="props.isSaving ? 'true' : 'false'"
    @submit.prevent="onSubmit"
  >
    <div class="account-details-form__fields" :aria-hidden="props.isLoading ? 'true' : 'false'">
      <Input
        class="account-details-form__input"
        placeholder="First name*"
        name="first_name"
        autocomplete="given-name"
        v-model="firstName"
        v-bind="firstNameAttrs"
        :error-message="errors.first_name"
      />

      <Input
        class="account-details-form__input"
        placeholder="Last name*"
        name="last_name"
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttrs"
        :error-message="errors.last_name"
      />

      <Input
        class="account-details-form__input"
        placeholder="Display name*"
        name="display_name"
        autocomplete="nickname"
        v-model="displayName"
        v-bind="displayNameAttrs"
        :error-message="errors.display_name"
      />

      <Input
        class="account-details-form__input"
        placeholder="Email address*"
        name="email"
        inputmode="email"
        autocomplete="email"
        v-model="email"
        v-bind="emailAttrs"
        :error-message="errors.email"
      />

      <div class="account-details-form__section-title" role="heading" aria-level="2">
        Password change
      </div>

      <Input
        class="account-details-form__input"
        placeholder="Current password (leave blank to leave unchanged)"
        name="current_password"
        type="password"
        autocomplete="current-password"
        v-model="currentPassword"
        v-bind="currentPasswordAttrs"
        :error-message="errors.current_password"
      />

      <Input
        class="account-details-form__input"
        placeholder="New password (leave blank to leave unchanged)"
        name="new_password"
        type="password"
        autocomplete="new-password"
        v-model="newPassword"
        v-bind="newPasswordAttrs"
        :error-message="errors.new_password"
      />

      <Input
        class="account-details-form__input"
        placeholder="Confirm new password"
        name="confirm_new_password"
        type="password"
        autocomplete="new-password"
        v-model="confirmNewPassword"
        v-bind="confirmNewPasswordAttrs"
        :error-message="errors.confirm_new_password"
      />
    </div>

    <Button
      class="account-details-form__submit full"
      type="submit"
      variant="primary"
      :disabled="props.isDisabled || props.isSaving || props.isLoading"
      aria-label="Save account details"
    >
      {{ props.isSaving ? 'SAVING...' : props.submitLabel }}
    </Button>
  </form>
</template>

<style scoped lang="scss">
.account-details-form {
  font-family: var(--font-family);
  display: flex;
  flex-direction: column;
  gap: globalFunctions.fluidValue(18px, 28px, 320px, 1440px);

  &__fields {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(18px, 28px, 320px, 1440px);
  }

  &__section-title {
    margin-top: globalFunctions.fluidValue(8px, 18px, 320px, 1440px);
    font-weight: 700;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
  }

  &__submit {
    text-transform: uppercase;
    letter-spacing: 0.02em;
    justify-content: center;
  }
}
</style>

