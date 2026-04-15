<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { supabase } from '@/shared/api/supabase/client'
import { useAuthStore } from '@/entities/auth/model/auth.store'
import { userApi } from '@/entities/user/api/user'
import type { UserProfile } from '@/entities/user/model/types'
import AccountDetailsForm, {
  type AccountDetailsFormValues,
} from '@/entities/user/ui/AccountDetailsForm.vue'
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'

const authStore = useAuthStore()

const isLoading = ref(false)
const isSaving = ref(false)
const profile = ref<UserProfile | null>(null)
const externalErrors = ref<Partial<Record<keyof AccountDetailsFormValues, string>>>({})

const userId = computed(() => authStore.user?.id ?? null)

function mapProfileToValues(p: UserProfile | null): AccountDetailsFormValues {
  return {
    first_name: p?.first_name ?? '',
    last_name: p?.last_name ?? '',
    display_name: p?.display_name ?? '',
    email: p?.email ?? authStore.user?.email ?? '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  }
}

const initialValues = computed<AccountDetailsFormValues>(() => mapProfileToValues(profile.value))

async function loadProfile(id: string) {
  isLoading.value = true
  try {
    profile.value = await userApi.getUserProfile(id)
  } finally {
    isLoading.value = false
  }
}

async function onSubmit(values: AccountDetailsFormValues) {
  const id = userId.value
  if (!id) return
  if (isSaving.value) return

  externalErrors.value = {}
  isSaving.value = true
  try {
    await userApi.updateProfile(id, {
      first_name: values.first_name,
      last_name: values.last_name,
      display_name: values.display_name,
      email: values.email,
    })

    await loadProfile(id)
    toast.success('Account details saved')
  } catch (e: any) {
    toast.error(e?.message ? String(e.message) : 'Failed to save account details')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (userId.value) await loadProfile(userId.value)
})

watch(
  () => userId.value,
  async (id) => {
    if (id) await loadProfile(id)
    else profile.value = null
  },
)
</script>

<template>
  <div class="account-details-page" aria-label="Account details content">
    <SectionLayout>
      <template #title> Account details </template>
      <template #content>
        <AccountDetailsForm
          class="account-details-page__form"
          :initial-values="initialValues"
          :is-loading="isLoading"
          :is-saving="isSaving"
          :is-disabled="!profile"
          :external-errors="externalErrors"
          @submit="onSubmit"
        />
      </template>
    </SectionLayout>
  </div>
</template>

<style scoped lang="scss">
.account-details-page {
  max-width: 680px;
  margin-inline: auto;
  &__title {
    margin-bottom: globalFunctions.fluidValue(24px, 37px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }
  &__form {
    width: 100%;
  }

  :deep(.section-layout) {
    margin: 0;
    padding: 0;
  }

  :deep(.section-layout__title) {
    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }
}
</style>
