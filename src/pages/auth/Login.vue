<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import { useAuthStore } from '@/entities/auth/model/auth.store'

const router = useRouter()
const isSubmitting = ref(false)
const auth = useAuthStore()

const validationSchema = yup.object({
  email: yup.string().trim().email('Email must be valid').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  remember: yup.boolean().default(false),
})

const { defineField, errors, handleSubmit } = useForm<{
  email: string
  password: string
  remember: boolean
}>({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
    remember: false,
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [remember] = defineField('remember')

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    await auth.login({ email: values.email, password: values.password })
    router.push({ name: 'home' })
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form
    class="auth-form"
    :class="{ 'auth-form_submitting': isSubmitting }"
    aria-label="Sign in form"
    :aria-busy="isSubmitting"
    @submit.prevent="onSubmit"
  >
    <div v-if="isSubmitting" class="auth-form__overlay" aria-hidden="true">
      <div class="auth-form__overlay-inner">
        <Loader label="Signing you in..." />
      </div>
    </div>

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
        autocomplete="current-password"
        v-model="password"
        v-bind="passwordAttrs"
        :error-message="errors.password"
      />
    </div>

    <div class="auth-form__meta">
      <Checkbox v-model="remember" class="auth-form__remember" label="Remember me" />
    </div>

    <Button class="auth-form__submit full" type="submit" variant="primary" :disabled="isSubmitting">
      SIGN IN
    </Button>

    <div class="auth-form__footer">
      <button class="auth-form__link" type="button">Have you forgotten your password?</button>
    </div>
  </form>
</template>

<style scoped lang="scss" src="./auth-form.scss"></style>
