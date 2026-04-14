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
  first_name: yup.string().trim().required('First name is required'),
  last_name: yup.string().trim().required('Last name is required'),
  display_name: yup.string().trim().required('Display name is required'),
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
  first_name: string
  last_name: string
  display_name: string
  email: string
  password: string
  password_confirm: string
}>({
  validationSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
  },
})

const [firstName, firstNameAttrs] = defineField('first_name')
const [lastName, lastNameAttrs] = defineField('last_name')
const [displayName, displayNameAttrs] = defineField('display_name')
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
        placeholder="First name*"
        name="first_name"
        autocomplete="given-name"
        v-model="firstName"
        v-bind="firstNameAttrs"
        :error-message="errors.first_name"
      />

      <Input
        class="auth-form__input"
        placeholder="Last name*"
        name="last_name"
        autocomplete="family-name"
        v-model="lastName"
        v-bind="lastNameAttrs"
        :error-message="errors.last_name"
      />

      <Input
        class="auth-form__input"
        placeholder="Display name*"
        name="display_name"
        autocomplete="nickname"
        v-model="displayName"
        v-bind="displayNameAttrs"
        :error-message="errors.display_name"
      />

      <Input
        class="auth-form__input"
        placeholder="Email*"
        name="email"
        inputmode="email"
        autocomplete="email"
        v-model="email"
        v-bind="emailAttrs"
        :error-message="errors.email"
      />

      <Input
        class="auth-form__input"
        placeholder="Password*"
        name="password"
        type="password"
        autocomplete="new-password"
        v-model="password"
        v-bind="passwordAttrs"
        :error-message="errors.password"
      />

      <Input
        class="auth-form__input"
        placeholder="Confirm Password*"
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

<style scoped lang="scss" src="./auth-form.scss"></style>
