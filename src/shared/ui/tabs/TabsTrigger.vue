<script setup lang="ts">
import { inject, computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

type TabsVariant = 'line' | 'switch'

const props = withDefaults(
  defineProps<{
    id: string | number
    to?: RouteLocationRaw
    variant?: TabsVariant
  }>(),
  {
    variant: 'line',
  },
)
const context = inject<any>('tabsContext')

const isActive = computed(() => context.activeTab.value === props.id)

const onActivate = () => {
  context.setActiveTab(props.id)
}
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    class="tab-trigger"
    :class="{
      'tab-trigger_active': isActive,
      'tab-trigger_variant_switch': variant === 'switch',
    }"
    :to="to"
    role="tab"
    :aria-selected="isActive"
    @click="onActivate"
  >
    <slot :is-active="isActive" />
  </component>
</template>

<style lang="scss" scoped>
.tab-trigger {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);
  color: var(--light-colors-dark-gray---light);
  background: transparent;
  border: 0;
  text-decoration: none;
  position: relative;
  z-index: 2;
  white-space: nowrap;

  &_active {
    color: var(--light-colors-black---light);
  }

  &_variant_switch {
    flex: 1;
    font-size: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);
    color: var(--light-colors-black---light);
    padding-block: globalFunctions.fluidValue(4px, 12px, 320px, 1440px);

    &:focus-visible {
      outline: 2px solid #d8d8d8;
      outline-offset: 2px;
      border-radius: globalFunctions.fluidValue(5px, 8px, 320px, 1440px);
    }
  }
}
</style>
