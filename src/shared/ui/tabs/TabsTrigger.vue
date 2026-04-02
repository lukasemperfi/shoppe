<script setup lang="ts">
import { inject, computed } from 'vue'

const props = defineProps<{ id: string | number }>()
const context = inject<any>('tabsContext')

const isActive = computed(() => context.activeTab.value === props.id)
</script>

<template>
  <button
    class="tab-trigger"
    :class="{ 'tab-trigger_active': isActive }"
    @click="context.setActiveTab(props.id)"
  >
    <slot :is-active="isActive" />
  </button>
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
  font-size: 20px;
  color: var(--light-colors-dark-gray---light);

  &_active {
    color: var(--light-colors-black---light);
  }
}
</style>
