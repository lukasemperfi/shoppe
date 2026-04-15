<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/entities/auth/model/auth.store'
import Button from '@/shared/ui/button/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const onLogout = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await authStore.logout()
    toast.success('You are logged out')
    await router.push({ name: 'home' })
  } catch (e: any) {
    toast.error(e?.message ? String(e.message) : 'Failed to log out')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="account-logout" aria-label="Logout content">
    <p class="account-logout__hint">To sign out from your account, press the button below.</p>
    <Button
      variant="outline"
      color="black"
      class="account-logout__btn"
      :disabled="isLoading"
      :aria-disabled="isLoading"
      aria-label="Log out"
      @click="onLogout"
    >
      {{ isLoading ? 'Logging out…' : 'Log out' }}
    </Button>
  </div>
</template>

<style scoped lang="scss">
.account-logout {
  display: flex;
  flex-direction: column;
  gap: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
  max-width: 520px;
  margin-inline: auto;
  align-items: center;

  &__hint {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 24px, 320px, 1440px);
    color: var(--light-colors-black---light);
  }
}
</style>
