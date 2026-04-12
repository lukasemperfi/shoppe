<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { computed, watch } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    cartCount?: number
  }>(),
  {
    cartCount: 0,
  },
)

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const emit = defineEmits<{
  close: []
}>()

const showCartBadge = computed(() => props.cartCount > 0)

const close = () => emit('close')

const scrollLock = useScrollLock(document.documentElement)
watch(
  () => props.open,
  (isOpen) => {
    scrollLock.value = isOpen
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="header-mob-panel">
      <aside
        v-if="open"
        id="header-mobile-menu"
        class="header__mobile-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        @click.stop
      >
        <div class="header__mobile-panel-inner app-container">
          <div class="header__mobile-bar">
            <RouterLink to="/" class="header__logo" @click="close">
              <Icon name="logo" />
            </RouterLink>
            <div class="header__mobile-bar-actions">
              <RouterLink
                to="/cart"
                class="header__icon-btn header__cart"
                aria-label="Shopping cart"
                @click="close"
              >
                <span class="header__cart-inner">
                  <Icon name="cart" class="header__icon" />
                  <span v-if="showCartBadge" class="header__badge">{{
                    cartCount > 99 ? '99+' : cartCount
                  }}</span>
                </span>
              </RouterLink>
              <button
                type="button"
                class="header__mobile-close"
                aria-label="Close menu"
                @click="close"
              >
                <Icon name="menu-cross" class="header__icon" />
              </button>
            </div>
          </div>

          <div class="header__search header__search--mobile">
            <label class="header__search-field">
              <span class="header__search-icon-wrap" aria-hidden="true">
                <Icon name="search" class="header__icon header__icon--search-muted" />
              </span>
              <input
                v-model="searchQuery"
                type="search"
                class="header__search-input"
                placeholder="Search"
                autocomplete="off"
              />
            </label>
          </div>

          <nav class="header__mobile-nav" aria-label="Mobile main">
            <RouterLink to="/" class="header__mobile-link" @click="close">Home</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">Shop</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">About</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">Blog</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">Help</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">Contact</RouterLink>
            <RouterLink to="#" class="header__mobile-link" @click="close">Search</RouterLink>
          </nav>

          <div class="header__mobile-sep" role="separator" />

          <nav class="header__mobile-nav header__mobile-nav--account" aria-label="Account">
            <RouterLink to="#" class="header__mobile-account-link" @click="close">
              <Icon name="profile" />
              <span>My account</span>
            </RouterLink>
            <RouterLink to="#" class="header__mobile-account-link" @click="close">
              <Icon name="logout" />
              <span>Logout</span>
            </RouterLink>
          </nav>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.header__mobile-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--light-colors-white---light);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);

  @media (min-width: 769px) {
    display: none;
  }
}

.header__mobile-panel-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding-top: globalFunctions.fluidValue(12px, 65px, 320px, 1440px);
  scrollbar-gutter: stable;
  overflow: auto;
}

:deep(.app-container) {
  @media (max-width: 768px) {
    padding-right: globalFunctions.fluidValue(16px - 5px, 96px - 5px, 320px, 1440px);
  }
}

.header__logo {
  svg {
    width: globalFunctions.fluidValue(91px, 134px, 320px, 1440px);
  }
}

.header__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--light-colors-black---light);
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.65;
    }
  }
}

.header__cart {
  display: inline-flex;
}

.header__cart-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.header__badge {
  position: absolute;
  top: -5px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 999999px;
  background: var(--light-colors-white---light);
  color: var(--light-colors-black---light);
  font-family: var(--font-family);
  font-size: 10px;
  font-weight: 500;
  border: 1px solid var(--light-colors-black---light);

  @media (max-width: 769px) {
    top: -2px;
    right: -3px;
    min-width: 11px;
    height: 11px;
    padding: 2px;
    font-size: 7px;
  }
}

.header__icon {
  display: block;
  width: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
  height: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
}

.header__mobile-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: globalFunctions.fluidValue(11px, 16px, 320px, 1440px);
}

.header__mobile-bar-actions {
  display: flex;
  align-items: center;
  gap: globalFunctions.fluidValue(18px, 16px, 320px, 1440px);
}

.header__mobile-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--light-colors-black---light);
  cursor: pointer;
}

.header__search--mobile {
  width: 100%;

  svg {
    width: 12px;
    height: 13px;
  }
}

.header__search-field {
  display: flex;
  align-items: center;
  gap: globalFunctions.fluidValue(8px, 12px, 320px, 1440px);
  width: 100%;
  padding-inline: 10px;
  padding-block: 6px;
  border-radius: 4px;
  background: var(--light-colors-light-gray---light);
  cursor: text;
}

.header__search-icon-wrap {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--light-colors-dark-gray---light);

  :deep(svg path) {
    fill: currentColor;
  }
}

.header__icon--search-muted {
  width: globalFunctions.fluidValue(16px, 18px, 320px, 1440px);
  height: globalFunctions.fluidValue(16px, 18px, 320px, 1440px);
}

.header__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
  line-height: globalFunctions.fluidValue(20px, 24px, 320px, 1440px);
  color: var(--light-colors-black---light);

  &::placeholder {
    color: var(--light-colors-dark-gray---light);
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
}

.header__mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 19px;
  margin-top: 37px;
}

.header__mobile-nav--account {
  gap: 12px;
  font-size: 20px;
  margin-top: 17px;
}

.header__mobile-link {
  width: 100%;
  padding-block: globalFunctions.fluidValue(4px, 6px, 320px, 1440px);
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 20px;
  line-height: globalFunctions.fluidValue(22px, 26px, 320px, 1440px);
  color: var(--light-colors-black---light);
  text-decoration: none;
  transition: opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.65;
    }
  }
}

.header__mobile-sep {
  height: 1px;
  margin-top: 38px;
  background: var(--light-colors-gray---light);
  flex-shrink: 0;
}

.header__mobile-account-link {
  display: flex;
  align-items: center;
  gap: globalFunctions.fluidValue(10px, 14px, 320px, 1440px);
  width: 100%;
  padding-block: 6px;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 20px;
  color: var(--light-colors-black---light);
  text-decoration: none;
  transition: opacity 0.2s ease;

  :deep(svg) {
    width: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
    height: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
    flex-shrink: 0;
  }

  @media (hover: hover) {
    &:hover {
      opacity: 0.65;
    }
  }
}
</style>

<style lang="scss">
.header-mob-overlay-enter-active,
.header-mob-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.header-mob-overlay-enter-from,
.header-mob-overlay-leave-to {
  opacity: 0;
}

.header-mob-panel-enter-active,
.header-mob-panel-leave-active {
  transition: transform 0.3s ease;
}

.header-mob-panel-enter-from,
.header-mob-panel-leave-to {
  transform: translateX(-100%);
}
</style>
