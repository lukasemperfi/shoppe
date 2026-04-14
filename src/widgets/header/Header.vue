<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import MiniCart from '@/widgets/mini-cart/MiniCart.vue'
import type { MiniCartLine } from '@/widgets/mini-cart/types'
import type { CartViewItem } from '@/entities/cart'
import { useCartStore } from '@/entities/cart'
import HeaderMobileMenu from './HeaderMobileMenu.vue'
import HeaderBlogMegaMenu from './HeaderBlogMegaMenu.vue'
import HeaderShopMegaMenu from './HeaderShopMegaMenu.vue'
import HeaderAccountMenu from './HeaderAccountMenu.vue'

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const isMenuOpen = ref(false)
const isMiniCartOpen = ref(false)
const isAuthorized = ref(true)

const cart = useCartStore()

function viewItemToMiniCartLine(v: CartViewItem): MiniCartLine {
  const images = v.product.product_images ?? []
  const main = images.find((img) => img.is_main) ?? images[0]
  return {
    id: v.cartItemId,
    name: v.product.name,
    variant: v.selectedColor ? v.selectedColor.color_name : '—',
    unitPrice: v.unitPrice,
    quantity: v.quantity,
    imageSrc: main?.url ?? '',
    imageAlt: v.product.name,
  }
}

const cartLines = computed(() => cart.viewItems.map(viewItemToMiniCartLine))

const cartCount = computed(() => cart.cartCount)

const showCartBadge = computed(() => cartCount.value > 0)

const openMiniCart = () => {
  isMiniCartOpen.value = true
}

const onMiniCartUpdateQuantity = (payload: { id: string; quantity: number }) => {
  cart.setQuantity(payload.id, payload.quantity)
}

const onMiniCartRemove = (id: string) => {
  cart.removeItem(id)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const onLogout = () => {
  isAuthorized.value = false
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
              <RouterLink to="/shop" class="header__link">Shop</RouterLink>
            </HeaderShopMegaMenu>
            <HeaderBlogMegaMenu>
              <RouterLink to="/blog" class="header__link">Blog</RouterLink>
            </HeaderBlogMegaMenu>
            <RouterLink to="/our-story" class="header__link">Our Story</RouterLink>
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

            <button
              type="button"
              class="header__icon-btn header__cart"
              aria-label="Open shopping bag"
              aria-haspopup="dialog"
              :aria-expanded="isMiniCartOpen"
              @click="openMiniCart"
            >
              <span class="header__cart-inner">
                <Icon name="cart" class="header__icon" aria-hidden="true" />
                <span v-if="showCartBadge" class="header__badge">{{
                  cartCount > 99 ? '99+' : cartCount
                }}</span>
              </span>
            </button>

            <HeaderAccountMenu :is-authorized="isAuthorized" @logout="onLogout">
              <Icon name="profile" class="header__icon" />
            </HeaderAccountMenu>

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

        <MiniCart
          v-model="isMiniCartOpen"
          :items="cartLines"
          @update:quantity="onMiniCartUpdateQuantity"
          @remove="onMiniCartRemove"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  $bottom-padding: globalFunctions.fluidValue(12px, 22px, 320px, 1440px);

  width: 100%;
  background: var(--light-colors-white---light);
  padding-top: globalFunctions.fluidValue(12px, 57px, 320px, 1440px);

  &__shell {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(0px, 16px, 320px, 1440px);
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: globalFunctions.fluidValue(12px, 47px, 320px, 1440px);
    border-bottom: 1px solid var(--light-colors-gray---light);

    @media (max-width: 769px) {
      padding-block: 0px;
      border-bottom: none;
    }
  }

  &__logo {
    padding-bottom: $bottom-padding;
    svg {
      width: globalFunctions.fluidValue(91px, 134px, 320px, 1440px);
    }
  }

  &__logo-accent {
    color: var(--light-colors-accent---light);
  }

  &__logo-rest {
    color: var(--light-colors-black---light);
  }

  &__nav {
    display: flex;
    align-items: center;
  }

  &__nav--desktop {
    display: none;
    margin-left: auto;
    gap: globalFunctions.fluidValue(20px, 65px, 320px, 1440px);

    @media (min-width: 769px) {
      display: flex;
    }
  }

  &__link {
    position: relative;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(22px, 27px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s ease;
    padding-bottom: 22px;

    &.router-link-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--light-colors-black---light);
      pointer-events: none;
      user-select: none;
    }

    @media (hover: hover) {
      &:hover {
        opacity: 0.65;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: globalFunctions.fluidValue(14px, 38px, 320px, 1440px);
    padding-bottom: $bottom-padding;
  }

  &__divider {
    width: 1px;
    flex-shrink: 0;
    background: var(--light-colors-dark-gray---light);
    margin-bottom: $bottom-padding;
  }

  &__divider--desktop {
    display: none;
    height: globalFunctions.fluidValue(16px, 17px, 320px, 1440px);

    @media (min-width: 769px) {
      display: block;
    }
  }

  &__icon-btn {
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

  &__icon-btn--desktop {
    display: none;

    @media (min-width: 769px) {
      display: inline-flex;
    }
  }

  &__cart {
    display: inline-flex;
  }

  &__cart-inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__badge {
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

  &__icon {
    display: block;
    width: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
    height: globalFunctions.fluidValue(18px, 21px, 320px, 1440px);
  }

  &__icon--menu {
    width: globalFunctions.fluidValue(20px, 21px, 320px, 1440px);
    height: globalFunctions.fluidValue(15px, 16px, 320px, 1440px);

    @media (max-width: 769px) {
      width: 22px;
      height: 15.5px;
    }
  }

  &__menu-btn {
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

  &__search--mobile {
    display: none;
    @media (max-width: 768px) {
      width: 100%;
      display: block;
    }

    svg {
      width: 12px;
      height: 13px;
    }
  }

  &__search-field {
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

  &__search-icon-wrap {
    display: inline-flex;
    flex-shrink: 0;
    color: var(--light-colors-dark-gray---light);

    :deep(svg path) {
      fill: currentColor;
    }
  }

  &__icon--search-muted {
    width: globalFunctions.fluidValue(16px, 18px, 320px, 1440px);
    height: globalFunctions.fluidValue(16px, 18px, 320px, 1440px);
  }

  &__search-input {
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
}
</style>
