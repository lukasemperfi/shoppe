<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'

const router = useRouter()
const isSubmitting = ref(false)

const validationSchema = yup.object({
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  password_confirm: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

const { defineField, errors, handleSubmit } = useForm<{
  email: string
  password: string
  password_confirm: string
}>({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
    password_confirm: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('password_confirm')

const onSubmit = handleSubmit(async () => {
  isSubmitting.value = true
  try {
    // TODO: connect real auth API
    await new Promise((r) => setTimeout(r, 350))
    router.push({ name: 'home' })
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form class="auth-form" aria-label="Register form" @submit.prevent="onSubmit">
    <div class="auth-form__fields">
      <Input
        class="auth-form__input"
        placeholder="Email"
        name="email"
        inputmode="email"
        autocomplete="email"
        v-model="email"
        v-bind="emailAttrs"
        :error-message="errors.email"
      />

      <Input
        class="auth-form__input"
        placeholder="Password"
        name="password"
        type="password"
        autocomplete="new-password"
        v-model="password"
        v-bind="passwordAttrs"
        :error-message="errors.password"
      />

      <Input
        class="auth-form__input"
        placeholder="Confirm Password"
        name="password_confirm"
        type="password"
        autocomplete="new-password"
        v-model="passwordConfirm"
        v-bind="passwordConfirmAttrs"
        :error-message="errors.password_confirm"
      />
    </div>

    <Button class="auth-form__submit full" type="submit" variant="primary" :disabled="isSubmitting">
      REGISTER
    </Button>
  </form>
</template>

<style scoped lang="scss">
.auth-form {
  width: 100%;

  &__fields {
    display: grid;
    gap: globalFunctions.fluidValue(18px, 26px, 320px, 1440px);
    margin-bottom: globalFunctions.fluidValue(18px, 24px, 320px, 1440px);
  }

  &__submit {
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}
</style>
