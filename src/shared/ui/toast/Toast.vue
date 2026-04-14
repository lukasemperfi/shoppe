<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'
export type ToastType = 'success'

withDefaults(
  defineProps<{
    type?: ToastType
  }>(),
  {
    type: 'success',
  },
)
</script>

<template>
  <div class="toast" :class="`toast_${type}`" role="status" aria-live="polite">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.toast {
  $layout-min: 320px;
  $layout-max: 1440px;

  display: flex;
  align-items: center;
  width: 100%;
  min-height: globalFunctions.fluidValue(56px, 68px, $layout-min, $layout-max);
  padding-inline: globalFunctions.fluidValue(16px, 39px, $layout-min, $layout-max);
  gap: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
  font-family: var(--font-family);
  background: var(--light-colors-light-gray---light, #efefef);
  border-top: 2px solid var(--light-colors-accent---light, #a18a68);
}
</style>
