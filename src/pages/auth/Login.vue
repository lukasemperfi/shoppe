<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'

const router = useRouter()
const isSubmitting = ref(false)

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
  <form class="auth-form" aria-label="Sign in form" @submit.prevent="onSubmit">
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

<style scoped lang="scss">
.auth-form {
  width: 100%;

  &__fields {
    display: grid;
    gap: globalFunctions.fluidValue(24px, 45px, 320px, 1440px);
    margin-bottom: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  }

  &__meta {
    margin-bottom: globalFunctions.fluidValue(12px, 75px, 320px, 1440px);

    :deep(.checkbox__label) {
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
      color: var(--light-colors-black---light);
    }

    :deep(.checkbox__box) {
      width: 16px;
      height: 16px;
    }
  }

  &__submit {
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__footer {
    margin-top: globalFunctions.fluidValue(14px, 18px, 320px, 1440px);
    display: flex;
    justify-content: center;
  }

  &__link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-decoration: none;

    &:focus-visible {
      outline: 2px solid #d8d8d8;
      outline-offset: 2px;
    }
  }
}
</style>
