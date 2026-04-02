<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{ id: string | number }>()
const context = inject<any>('tabsContext')
</script>

<template>
  <div v-if="context.activeTab.value === props.id" class="tab-panel">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.tab-panel {
  width: 100%;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
