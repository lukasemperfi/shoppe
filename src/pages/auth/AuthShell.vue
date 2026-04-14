<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = computed<'login' | 'register' | null>(() => {
  if (route.name === 'login') return 'login'
  if (route.name === 'register') return 'register'
  return null
})
</script>

<template>
  <main class="auth-page">
    <div class="auth-page__inner">
      <nav class="auth-tabs" role="tablist" aria-label="Authentication tabs">
        <RouterLink
          class="auth-tabs__tab"
          :class="{ 'auth-tabs__tab_active': activeTab === 'login' }"
          :to="{ name: 'login' }"
          role="tab"
          :aria-selected="activeTab === 'login'"
        >
          Sign in
        </RouterLink>

        <RouterLink
          class="auth-tabs__tab"
          :class="{ 'auth-tabs__tab_active': activeTab === 'register' }"
          :to="{ name: 'register' }"
          role="tab"
          :aria-selected="activeTab === 'register'"
        >
          Register
        </RouterLink>
      </nav>

      <section
        class="auth-page__content"
        :aria-label="activeTab === 'register' ? 'Register' : 'Sign in'"
      >
        <RouterView />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: globalFunctions.fluidValue(32px, 96px, 320px, 1440px) 16px;
  font-family: var(--font-family);

  &__inner {
    width: 100%;
    max-width: 420px;
  }

  &__content {
    margin-top: globalFunctions.fluidValue(18px, 34px, 320px, 1440px);
  }
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  &__tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    padding-inline: 12px;
    border: 1px solid var(--light-colors-gray---light);
    border-radius: 4px;
    text-decoration: none;

    font-family: var(--font-family);
    font-weight: 400;
    font-size: 14px;
    color: var(--light-colors-black---light);

    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &_active {
      background: #ffffff;
      border-color: var(--light-colors-black---light);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
    }

    &:focus-visible {
      outline: 2px solid #d8d8d8;
      outline-offset: 2px;
    }
  }
}
</style>
