<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, watch, nextTick } from 'vue'

const context = inject<any>('tabsContext')
const listRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const indicatorStyle = ref({
  width: '0px',
  left: '0px',
  transition: 'none',
})

const updateIndicator = (animate = true) => {
  nextTick(() => {
    if (!listRef.value) {
      return
    }
    const activeElement = listRef.value.querySelector('.tab-trigger_active') as HTMLElement

    if (activeElement) {
      indicatorStyle.value = {
        width: `${activeElement.offsetWidth}px`,
        left: `${activeElement.offsetLeft}px`,
        transition: animate ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }
    }
  })
}

watch(
  () => context?.activeTab.value,
  () => updateIndicator(true),
)

onMounted(() => {
  updateIndicator(false)

  resizeObserver = new ResizeObserver(() => {
    updateIndicator(false)
  })

  if (listRef.value) {
    resizeObserver.observe(listRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div class="tabs-list-wrapper">
    <div class="tabs-list" ref="listRef">
      <slot />
      <div class="tabs-indicator" :style="indicatorStyle"></div>
    </div>
    <div class="tabs-line-base"></div>
  </div>
</template>

<style lang="scss" scoped>
.tabs-list-wrapper {
  position: relative;
  width: 100%;
}

.tabs-list {
  display: flex;
  gap: 62px;
  position: relative;
  padding-bottom: 12px;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 24px;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tabs-line-base {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--light-colors-gray---light, #d8d8d8);
  z-index: 1;
}

.tabs-indicator {
  position: absolute;
  bottom: 0;
  height: 1px;
  background-color: var(--light-colors-black---light, #000000);
  z-index: 3;
  will-change: left, width;
}
</style>
