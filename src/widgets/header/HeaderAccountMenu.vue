<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Props = {
  isAuthorized: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  logout: []
}>()

const isDesktop = useMediaQuery('(min-width: 769px)')

const router = useRouter()
const route = useRoute()

const open = ref(false)
const referenceRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)

const floatingOpen = computed(() => open.value && isDesktop.value && !!referenceRef.value)

const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  open: floatingOpen,
  placement: 'bottom-end',
  strategy: 'fixed',
  middleware: [offset(10), flip(), shift({ padding: 12 })],
  whileElementsMounted: autoUpdate,
})

const close = () => {
  open.value = false
}

const onTriggerClick = async () => {
  if (!props.isAuthorized) {
    close()
    await router.push({ name: 'login' })
    return
  }

  open.value = !open.value
}

const onDocumentPointerDown = (e: PointerEvent) => {
  if (!open.value) return

  const target = e.target as Node | null
  if (!target) return

  const refEl = referenceRef.value
  const floatEl = floatingRef.value

  if (refEl?.contains(target) || floatEl?.contains(target)) return
  close()
}

const onDocumentKeyDown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Escape') close()
}

watch(isDesktop, (desktop) => {
  if (!desktop) close()
})

watch(
  () => route.fullPath,
  () => close(),
)

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeyDown)
})
</script>

<template>
  <div class="header__account">
    <button
      ref="referenceRef"
      type="button"
      class="header__icon-btn header__icon-btn--desktop"
      aria-label="Account"
      aria-haspopup="menu"
      :aria-expanded="open"
      aria-controls="header-account-menu"
      @click="onTriggerClick"
    >
      <slot />
    </button>

    <div
      v-if="open && isDesktop"
      id="header-account-menu"
      ref="floatingRef"
      class="header__account-panel"
      :style="floatingStyles"
      role="menu"
      aria-label="Account menu"
    >
      <ul class="header__account-list">
        <li class="header__account-item" role="none">
          <RouterLink to="#" class="header__account-link" role="menuitem" @click="close">
            My Account
          </RouterLink>
        </li>
        <li class="header__account-item" role="none">
          <button
            type="button"
            class="header__account-link header__account-link_logout"
            role="menuitem"
            @click="
              () => {
                close()
                emit('logout')
              }
            "
          >
            Log out
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header__account {
  position: relative;
  display: inline-flex;
}

.header__account-panel {
  z-index: 220;
  min-width: 180px;
  padding-block: 10px;
  background: var(--light-colors-white---light);
  border: 1px solid var(--light-colors-gray---light);
}

.header__account-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.header__account-item {
  display: flex;
}

.header__account-link {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 18px;
  border: none;
  background: transparent;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3;
  color: var(--light-colors-dark-gray---light);
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--light-colors-black---light);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--light-colors-black---light);
    outline-offset: 2px;
  }

  &_logout {
    color: var(--light-colors-black---light);
  }
}
</style>
