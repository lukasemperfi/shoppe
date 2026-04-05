<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const shopMegaColumns = [
  {
    title: 'SHOP TYPES',
    links: [
      'Shop full width',
      'Shop With sidebar',
      'Shop category',
      'Shop carousel',
      'Masonry grid',
    ],
  },
  {
    title: 'SINGLE PRODUCT',
    links: [
      'Standard product',
      'Variable product',
      'On sale product',
      'Out of stock product',
      'New! Product',
    ],
  },
  {
    title: 'SHOP PAGES',
    links: ['Cart', 'Checkout', 'My account', 'Wishlist', 'Order tracking'],
  },
] as const

const isDesktop = useMediaQuery('(min-width: 769px)')
const shopMegaOpen = ref(false)
const shopMegaReferenceRef = ref<HTMLElement | null>(null)
const shopMegaFloatingRef = ref<HTMLElement | null>(null)

let shopMegaHideTimer: ReturnType<typeof setTimeout> | null = null

const clearShopMegaHideTimer = () => {
  if (shopMegaHideTimer !== null) {
    clearTimeout(shopMegaHideTimer)
    shopMegaHideTimer = null
  }
}

const openShopMega = () => {
  clearShopMegaHideTimer()
  if (isDesktop.value) {
    shopMegaOpen.value = true
  }
}

const closeShopMega = () => {
  clearShopMegaHideTimer()
  shopMegaOpen.value = false
}

const scheduleCloseShopMega = () => {
  clearShopMegaHideTimer()
  shopMegaHideTimer = setTimeout(() => {
    shopMegaOpen.value = false
    shopMegaHideTimer = null
  }, 120)
}

onUnmounted(() => {
  clearShopMegaHideTimer()
})

const isFloatingReady = ref(false)
onMounted(() => {
  void nextTick(() => {
    isFloatingReady.value = true
  })
})

const shopMegaMenuOpen = computed(() => shopMegaOpen.value && isDesktop.value)

const shopFloatingOpen = computed(
  () =>
    isFloatingReady.value &&
    shopMegaMenuOpen.value &&
    !!shopMegaReferenceRef.value &&
    !!shopMegaFloatingRef.value,
)

const { floatingStyles } = useFloating(shopMegaReferenceRef, shopMegaFloatingRef, {
  open: shopFloatingOpen,
  placement: 'bottom',
  strategy: 'fixed',
  middleware: [offset(0), flip(), shift({ padding: 12 })],
  whileElementsMounted: autoUpdate,
})

watch(isDesktop, (desktop) => {
  if (!desktop) {
    shopMegaOpen.value = false
  }
})
</script>

<template>
  <div class="header__shop" @mouseenter="openShopMega" @mouseleave="scheduleCloseShopMega">
    <div ref="shopMegaReferenceRef" class="header__shop-trigger">
      <slot />
    </div>
    <div
      v-show="shopMegaMenuOpen"
      ref="shopMegaFloatingRef"
      class="header__mega"
      :style="floatingStyles"
      role="region"
      aria-label="Shop categories"
      @mouseenter="openShopMega"
      @mouseleave="scheduleCloseShopMega"
    >
      <div class="header__mega-inner">
        <div v-for="col in shopMegaColumns" :key="col.title" class="header__mega-col">
          <p class="header__mega-title">{{ col.title }}</p>
          <ul class="header__mega-list">
            <li v-for="item in col.links" :key="item" class="header__mega-item">
              <RouterLink to="#" class="header__mega-link" @click="closeShopMega">{{
                item
              }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header__shop {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.header__shop-trigger {
  display: inline-flex;
}

.header__mega {
  z-index: 200;
  padding-block: 32px;

  background: var(--light-colors-white---light);
  border: 1px solid var(--light-colors-gray---light);

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: -25px;
  //   left: 0;
  //   right: 0;
  //   height: 25px;
  //   background: transparent;
  // }
}

.header__mega-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
}

.header__mega-col {
  padding-inline: 28px;

  &:not(:first-child) {
    border-left: 1px solid var(--light-colors-gray---light);
  }
}

.header__mega-title {
  margin-bottom: 17px;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3;
  text-transform: uppercase;
  color: var(--light-colors-black---light);
}

.header__mega-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header__mega-item {
  &:last-child {
    margin-bottom: 0;
  }
}

.header__mega-link {
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  color: var(--light-colors-dark-gray---light);
  text-decoration: none;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--light-colors-black---light);
    }
  }
}
</style>
