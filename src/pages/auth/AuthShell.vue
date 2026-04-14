<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'

const route = useRoute()
const router = useRouter()

const activeTab = computed<'login' | 'register' | null>(() => {
  if (route.name === 'login') return 'login'
  if (route.name === 'register') return 'register'
  return null
})

const tabModel = computed<'login' | 'register'>({
  get() {
    return activeTab.value ?? 'login'
  },
  set(value) {
    void router.push({ name: value })
  },
})
</script>

<template>
  <div class="auth-page">
    <div class="app-container">
      <SectionLayout class="auth-page__section-layout">
        <template #title>My account</template>
        <template #content>
          <Tabs v-model="tabModel" default-tab="login">
            <TabsList
              class="auth-tabs"
              variant="switch"
              align="center"
              aria-label="Authentication tabs"
            >
              <TabsTrigger id="login" variant="switch" :to="{ name: 'login' }">
                Sign in
              </TabsTrigger>
              <TabsTrigger id="register" variant="switch" :to="{ name: 'register' }">
                Register
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <section
            class="auth-page__content"
            :aria-label="activeTab === 'register' ? 'Register' : 'Sign in'"
          >
            <RouterView />
          </section>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  &__content {
    margin-top: globalFunctions.fluidValue(86px, 125px, 320px, 1440px);
  }
  &__section-layout {
    max-width: 500px;
    margin-inline: auto;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      max-width: 100%;
    }
  }
}
</style>
