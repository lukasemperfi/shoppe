<script setup lang="ts">
import { onMounted, onUnmounted, provide, watch } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import { useScrollLock } from '@vueuse/core'

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
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-container" v-bind="$attrs">
          <header class="modal-header">
            <slot v-if="$slots['header-left-default']" name="header-left-default" />
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
  background: rgba(35, 31, 32, 0.7);
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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 24px;
  position: relative;

  &__center {
    flex: 1;
    display: flex;
    justify-content: center;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: var(--light-colors-black---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-size: 22px;
    }
  }

  &__right {
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    right: 24px;
    left: 24px;
    justify-self: flex-end;
  }
}

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
</style>
