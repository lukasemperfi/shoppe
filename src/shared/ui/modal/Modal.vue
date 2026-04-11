<script setup lang="ts">
import { onMounted, onUnmounted, provide, watch } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import { useScrollLock } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    instantClose?: boolean
    variant?: 'default' | 'drawer-end'
  }>(),
  {
    instantClose: false,
    variant: 'default',
  },
)

const isOpen = defineModel<boolean>({ default: false })
defineOptions({
  inheritAttrs: false,
})
provide('modalContext', { isOpen })

const isScrollLocked = useScrollLock(document.body)

watch(isOpen, (val) => {
  isScrollLocked.value = val
})

const close = () => {
  isOpen.value = false
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onUnmounted(() => document.removeEventListener('keydown', handleEscape))
</script>

<template>
  <Teleport to="body">
    <Transition
      :name="props.variant === 'drawer-end' ? 'modal-drawer' : 'modal-fade'"
      :css="!props.instantClose"
    >
      <div
        v-if="isOpen"
        class="modal-overlay"
        :class="{ 'modal-overlay_drawer-end': props.variant === 'drawer-end' }"
        @click.self="close"
      >
        <div
          class="modal-container"
          :class="{ 'modal-container_drawer-end': props.variant === 'drawer-end' }"
          v-bind="$attrs"
        >
          <header
            class="modal-header"
            :class="{ 'modal-header_drawer-end': props.variant === 'drawer-end' }"
          >
            <slot />
            <div v-if="$slots['header-left']" class="modal-header__left">
              <slot name="header-left" />
            </div>

            <div v-if="$slots['header-center']" class="modal-header__center">
              <slot name="header-center" />
            </div>

            <div class="modal-header__right">
              <slot name="header-right">
                <button class="modal-close" @click="close">
                  <Icon name="cross" class="modal-close__icon" />
                </button>
              </slot>
            </div>
          </header>

          <div class="modal-content">
            <slot name="content" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  padding-top: 5vh;
  padding-bottom: 5vh;

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.modal-container {
  position: relative;
  background: var(--light-colors-white---light);
  box-shadow: 0px 25px 40px rgba(0, 0, 0, 0.05);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-family);
  width: 654px;
  min-height: 200px;
  max-height: 90vh;
  padding-top: 45px;
  padding-bottom: 31px;

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    max-width: 100vw;
    max-height: 100vh;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding-top: 24px;
    padding-bottom: 24px;
  }
}

// .modal-header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding-inline: 24px;
//   position: relative;

//   &__center {
//     flex: 1;
//     display: flex;
//     justify-content: center;
//     font-weight: 700;
//     font-size: 24px;
//     line-height: 28px;
//     color: var(--light-colors-black---light);

//     @media (max-width: globalBreakpoints.$breakpoint-sm) {
//       font-size: 22px;
//     }
//   }

//   &__right {
//     flex: 0 0 40px;
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     position: absolute;
//     right: 24px;
//     left: 24px;
//     justify-self: flex-end;
//   }
// }

.modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }

  &__icon {
    width: 17px;
    height: 16px;

    :deep(path) {
      fill: var(--light-colors-black---light);
    }
  }
}

.modal-content {
  flex: 1;
  overflow-y: scroll;
  color: var(--light-colors-black---light);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9) translateY(20px);
  }
}

.modal-overlay_drawer-end {
  padding: 0;
  justify-content: flex-end;
  align-items: stretch;
}

.modal-container_drawer-end {
  width: 360px;
  height: 100vh;
  max-height: 100vh;
  min-height: 100vh;
  max-width: none;
  border-radius: 0;
  padding-top: 0;
  padding-bottom: 0;
  box-shadow: none;
  border: 1px solid var(--light-colors-gray---light);
  border-right: none;

  @media (max-width: globalBreakpoints.$breakpoint-sm) {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border: none;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}

// .modal-header_drawer-end {
//   display: grid;
//   grid-template-columns: minmax(32px, auto) 1fr minmax(32px, auto);
//   align-items: center;
//   gap: 8px;
//   padding-inline: 16px;
//   padding-block: 13px 8px;

//   @media (min-width: 769px) {
//     padding-inline: 36px;
//     padding-block: 24px 16px;
//   }

//   .modal-header__left {
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//   }

//   .modal-header__center {
//     position: static;
//     flex: unset;
//     justify-content: center;
//     font-weight: 400;
//     font-size: 16px;
//     line-height: 27px;
//     color: var(--light-colors-black---light);

//     @media (min-width: 769px) {
//       justify-content: flex-start;
//     }
//   }

//   .modal-header__right {
//     position: static;
//     flex: unset;
//     left: auto;
//     right: auto;
//     justify-content: flex-end;
//   }
// }

.modal-drawer-enter-active,
.modal-drawer-leave-active {
  transition: opacity 0.3s ease;

  .modal-container_drawer-end {
    transition: transform 0.3s ease;
  }
}

.modal-drawer-enter-from,
.modal-drawer-leave-to {
  opacity: 0;

  .modal-container_drawer-end {
    transform: translateX(100%);
  }
}
</style>
