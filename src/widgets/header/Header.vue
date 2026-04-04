<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    cartCount?: number
  }>(),
  {
    cartCount: 0,
  },
)

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const isMenuOpen = ref(false)

const showCartBadge = computed(() => props.cartCount > 0)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const scrollLock = useScrollLock(document.documentElement)
watch(isMenuOpen, (open) => {
  scrollLock.value = open
})
</script>

<template>
  <header class="header">
    <div class="app-container">
      <div class="header__shell">
        <div class="header__row">
          <RouterLink to="/" class="header__logo" @click="closeMenu">
            <Icon name="logo" />
          </RouterLink>

          <nav class="header__nav header__nav--desktop" aria-label="Main">
            <RouterLink to="#" class="header__link">Shop</RouterLink>
            <RouterLink to="#" class="header__link">Blog</RouterLink>
            <RouterLink to="#" class="header__link">Our Story</RouterLink>
          </nav>
          <span class="header__divider header__divider--desktop" aria-hidden="true" />
          <div class="header__actions">
            <button
              type="button"
              class="header__icon-btn header__icon-btn--desktop"
              aria-label="Search"
            >
              <Icon name="search" class="header__icon" />
            </button>

            <RouterLink to="#" class="header__icon-btn header__cart" aria-label="Shopping cart">
              <span class="header__cart-inner">
                <Icon name="cart" class="header__icon" />
                <span v-if="showCartBadge" class="header__badge">{{
                  cartCount > 99 ? '99+' : cartCount
                }}</span>
              </span>
            </RouterLink>

            <RouterLink
              to="#"
              class="header__icon-btn header__icon-btn--desktop"
              aria-label="Account"
            >
              <Icon name="profile" class="header__icon" />
            </RouterLink>

            <button
              type="button"
              class="header__menu-btn"
              :aria-expanded="isMenuOpen"
              aria-controls="header-mobile-menu"
              aria-label="Open menu"
              @click="toggleMenu"
            >
              <Icon name="menu" class="header__icon header__icon--menu" />
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

        <Teleport to="body">
          <Transition name="header-mob-overlay"> </Transition>
          <Transition name="header-mob-panel">
            <aside
              v-if="isMenuOpen"
              id="header-mobile-menu"
              class="header__mobile-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              @click.stop
            >
              <div class="header__mobile-panel-inner app-container">
                <div class="header__mobile-bar">
                  <RouterLink to="/" class="header__logo" @click="closeMenu">
                    <Icon name="logo" />
                  </RouterLink>
                  <div class="header__mobile-bar-actions">
                    <RouterLink
                      to="#"
                      class="header__icon-btn header__cart"
                      aria-label="Shopping cart"
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
                      @click="closeMenu"
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
                  <RouterLink to="/" class="header__mobile-link" @click="closeMenu"
                    >Home</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >Shop</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >About</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >Blog</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >Help</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >Contact</RouterLink
                  >
                  <RouterLink to="#" class="header__mobile-link" @click="closeMenu"
                    >Search</RouterLink
                  >
                </nav>

                <div class="header__mobile-sep" role="separator" />

                <nav class="header__mobile-nav header__mobile-nav--account" aria-label="Account">
                  <RouterLink to="#" class="header__mobile-account-link" @click="closeMenu">
                    <Icon name="profile" />
                    <span>My account</span>
                  </RouterLink>
                  <RouterLink to="#" class="header__mobile-account-link" @click="closeMenu">
                    <Icon name="logout" />
                    <span>Logout</span>
                  </RouterLink>
                </nav>
              </div>
            </aside>
          </Transition>
        </Teleport>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  background: var(--light-colors-white---light);
  padding-top: globalFunctions.fluidValue(12px, 65px, 320px, 1440px);
}

.header__shell {
  display: flex;
  flex-direction: column;
  gap: globalFunctions.fluidValue(11px, 16px, 320px, 1440px);
}

.header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: globalFunctions.fluidValue(12px, 47px, 320px, 1440px);
  padding-block: 7.5px;

  @media (max-width: 769px) {
    padding-block: 0px;
  }
}

.header__logo {
  svg {
    width: globalFunctions.fluidValue(91px, 134px, 320px, 1440px);
  }
}

.header__logo-accent {
  color: var(--light-colors-accent---light);
}

.header__logo-rest {
  color: var(--light-colors-black---light);
}

.header__nav {
  display: flex;
  align-items: center;
}

.header__nav--desktop {
  display: none;
  margin-left: auto;
  gap: globalFunctions.fluidValue(20px, 65px, 320px, 1440px);

  @media (min-width: 769px) {
    display: flex;
  }
}

.header__link {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
  line-height: globalFunctions.fluidValue(22px, 27px, 320px, 1440px);
  color: var(--light-colors-black---light);
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.65;
    }
  }
}

.header__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: globalFunctions.fluidValue(14px, 38px, 320px, 1440px);
}

.header__divider {
  width: 1px;
  flex-shrink: 0;
  background: var(--light-colors-dark-gray---light);
}

.header__divider--desktop {
  display: none;
  height: globalFunctions.fluidValue(16px, 17px, 320px, 1440px);

  @media (min-width: 769px) {
    display: block;
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

.header__icon-btn--desktop {
  display: none;

  @media (min-width: 769px) {
    display: inline-flex;
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

.header__icon--menu {
  width: globalFunctions.fluidValue(20px, 21px, 320px, 1440px);
  height: globalFunctions.fluidValue(15px, 16px, 320px, 1440px);

  @media (max-width: 769px) {
    width: 22px;
    height: 15.5px;
  }
}

.header__menu-btn {
  display: none;
  @media (max-width: 769px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--light-colors-black---light);
    cursor: pointer;
    align-self: baseline;
  }
}

.header__search--mobile {
  width: 100%;

  @media (min-width: 769px) {
    display: none;
  }

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

.header__mobile-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  width: 100vw;
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
  overflow-y: auto;
  padding-top: globalFunctions.fluidValue(12px, 65px, 320px, 1440px);
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

.header__mobile-search-field {
  display: flex;
  align-items: center;
  gap: globalFunctions.fluidValue(8px, 12px, 320px, 1440px);
  width: 100%;
  margin-bottom: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);
  padding-inline: 10px;
  padding-block: 6px;
  border-radius: 4px;
  background: var(--light-colors-light-gray---light);
  cursor: text;
}

.header__mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 19px;
  margin-top: 35px;
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

  @media (hover: hover) {
    &:hover {
      opacity: 0.65;
    }
  }
}

.header__icon--account {
  width: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
  height: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
  flex-shrink: 0;
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
