<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import HeaderMobileMenu from './HeaderMobileMenu.vue'
import HeaderShopMegaMenu from './HeaderShopMegaMenu.vue'

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
            <HeaderShopMegaMenu>
              <RouterLink to="#" class="header__link">Shop</RouterLink>
            </HeaderShopMegaMenu>
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

        <HeaderMobileMenu
          :open="isMenuOpen"
          v-model:search-query="searchQuery"
          :cart-count="cartCount"
          @close="closeMenu"
        />
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
  @media (max-width: 768px) {
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
  display: none;
  @media (max-width: 768px) {
    width: 100%;
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

</style>
