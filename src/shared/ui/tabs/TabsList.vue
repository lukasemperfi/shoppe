<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'

type TabsVariant = 'line' | 'switch'

const props = withDefaults(
  defineProps<{
    variant?: TabsVariant
    ariaLabel?: string
    align?: 'center' | 'left' | 'right'
  }>(),
  {
    variant: 'line',
    align: 'left',
  },
)

const listClasses = computed(() => {
  return {
    'tabs-list_align_center': props.align === 'center',
    'tabs-list_align_left': props.align === 'left',
    'tabs-list_align_right': props.align === 'right',
    'tabs-list_variant_switch': props.variant === 'switch',
  }
})
const context = inject<any>('tabsContext')
const listRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const indicatorStyle = ref({
  width: '0px',
  height: '0px',
  left: '0px',
  top: '0px',
  transition: 'none',
})

const isSwitchVariant = computed(() => props.variant === 'switch')

const updateIndicator = (animate = true) => {
  nextTick(() => {
    if (!listRef.value) {
      return
    }
    const activeElement = listRef.value.querySelector('.tab-trigger_active') as HTMLElement | null

    if (!activeElement) {
      return
    }

    const transition = animate ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'

    if (isSwitchVariant.value) {
      indicatorStyle.value = {
        width: `${activeElement.offsetWidth}px`,
        height: `${activeElement.offsetHeight}px`,
        left: `${activeElement.offsetLeft}px`,
        top: `${activeElement.offsetTop}px`,
        transition,
      }
      return
    }

    indicatorStyle.value = {
      width: `${activeElement.offsetWidth}px`,
      height: '1px',
      left: `${activeElement.offsetLeft}px`,
      top: 'auto',
      transition,
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
    <div
      class="tabs-list"
      :class="listClasses"
      ref="listRef"
      role="tablist"
      :aria-label="ariaLabel"
    >
      <slot />
      <div
        class="tabs-indicator"
        :class="{ 'tabs-indicator_variant_switch': variant === 'switch' }"
        :style="indicatorStyle"
        aria-hidden="true"
      ></div>
    </div>
    <div v-if="variant === 'line'" class="tabs-line-base" aria-hidden="true"></div>
  </div>
</template>

<style lang="scss" scoped>
.tabs-list-wrapper {
  position: relative;
  width: 100%;
}

.tabs-list {
  display: flex;
  justify-content: flex-start;
  gap: globalFunctions.fluidValue(24px, 62px, 320px, 1440px);
  position: relative;
  padding-bottom: 12px;
  z-index: 2;

  @media (max-width: 768px) {
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &_align_left {
    margin-right: auto;
  }

  &_align_center {
    margin-inline: auto;
  }

  &_align_right {
    margin-left: auto;
  }
  &_variant_switch {
    padding: globalFunctions.fluidValue(2px, 5px, 320px, 1440px);
    gap: globalFunctions.fluidValue(10px, 18px, 320px, 1440px);

    background: #efefef;
    border-radius: globalFunctions.fluidValue(5px, 8px, 320px, 1440px);

    @media (max-width: 560px) {
      width: 100%;
      max-width: 500px;
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

  &_variant_switch {
    bottom: auto;
    background: #ffffff;
    border-radius: globalFunctions.fluidValue(5px, 8px, 320px, 1440px);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    will-change: left, width, top, height;
  }
}
</style>
