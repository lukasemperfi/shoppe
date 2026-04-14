<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'

const route = useRoute()
const router = useRouter()

type AccountTab = 'dashboard' | 'orders' | 'downloads' | 'addresses' | 'account-details' | 'logout'

const activeTab = computed<AccountTab | null>(() => {
  if (route.name === 'dashboard') return 'dashboard'
  if (route.name === 'orders') return 'orders'
  if (route.name === 'downloads') return 'downloads'
  if (route.name === 'addresses') return 'addresses'
  if (route.name === 'account-details') return 'account-details'
  if (route.name === 'logout') return 'logout'
  return null
})

const tabModel = computed<AccountTab>({
  get() {
    return activeTab.value ?? 'dashboard'
  },
  set(value) {
    void router.push({ name: value })
  },
})

const activeTabLabel = computed(() => {
  switch (activeTab.value) {
    case 'dashboard':
      return 'Dashboard'
    case 'orders':
      return 'Orders'
    case 'downloads':
      return 'Downloads'
    case 'addresses':
      return 'Addresses'
    case 'account-details':
      return 'Account details'
    case 'logout':
      return 'Logout'
    default:
      return 'Dashboard'
  }
})
</script>

<template>
  <div class="account-page">
    <div class="app-container">
      <SectionLayout class="account-page__section-layout">
        <template #title>My account</template>
        <template #content>
          <Tabs v-model="tabModel" default-tab="dashboard">
            <TabsList class="account-page__tabs" align="left" aria-label="Account tabs">
              <TabsTrigger id="dashboard" :to="{ name: 'dashboard' }"> Dashboard </TabsTrigger>
              <TabsTrigger id="orders" :to="{ name: 'orders' }"> Orders </TabsTrigger>
              <TabsTrigger id="downloads" :to="{ name: 'downloads' }"> Downloads </TabsTrigger>
              <TabsTrigger id="addresses" :to="{ name: 'addresses' }"> Addresses </TabsTrigger>
              <TabsTrigger id="account-details" :to="{ name: 'account-details' }">
                Account details
              </TabsTrigger>
              <TabsTrigger id="logout" :to="{ name: 'logout' }"> Logout </TabsTrigger>
            </TabsList>
          </Tabs>

          <section class="account-page__content" :aria-label="activeTabLabel">
            <RouterView />
          </section>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-page {
  &__content {
    margin-top: 39px;
  }

  :deep(.tabs-list) {
    gap: globalFunctions.fluidValue(24px, 50px, 320px, 1440px);
  }
}
</style>
