<script setup lang="ts">
import { useAuthStore } from '@/entities/auth/model/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>
<template>
  <div class="account-dashboard" aria-label="Dashboard content">
    <p class="account-dashboard__text">
      Hello {{ authStore.user?.user_metadata.display_name }} (not
      {{ authStore.user?.user_metadata.display_name }}?
      <button class="account-dashboard__link" @click="logout">Log out</button>)
    </p>
    <p class="account-dashboard__text">
      From your account dashboard you can view your
      <RouterLink to="/account/orders" class="account-dashboard__link">recent orders</RouterLink>,
      manage your
      <RouterLink to="/account/addresses" class="account-dashboard__link"
        >shipping and billing addresses</RouterLink
      >
      , and edit your
      <RouterLink to="/account/account-details" class="account-dashboard__link"
        >password and account details.</RouterLink
      >
    </p>
  </div>
</template>

<style scoped lang="scss">
.account-dashboard {
  display: flex;
  flex-direction: column;
  gap: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
  &__text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    line-height: 20px;
  }

  &__link {
    color: var(--light-colors-accent---light);
  }
}
</style>
