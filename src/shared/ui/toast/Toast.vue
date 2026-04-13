<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'
export type ToastType = 'success'

withDefaults(
  defineProps<{
    text: string
    type?: ToastType
  }>(),
  {
    type: 'success',
  },
)
</script>

<template>
  <div class="toast" :class="`toast_${type}`" role="status" aria-live="polite">
    <Icon name="circle-checkmark" />
    <p class="toast__text">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.toast {
  $layout-min: 320px;
  $layout-max: 1440px;

  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 1248px;
  min-height: globalFunctions.fluidValue(56px, 68px, $layout-min, $layout-max);
  padding-inline: globalFunctions.fluidValue(16px, 39px, $layout-min, $layout-max);
  gap: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
  font-family: var(--font-family);
  background: var(--light-colors-light-gray---light, #efefef);
  border-top: 2px solid var(--light-colors-accent---light, #a18a68);

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: globalFunctions.fluidValue(18px, 20px, $layout-min, $layout-max);
    height: globalFunctions.fluidValue(18px, 20px, $layout-min, $layout-max);
  }

  &__icon-svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__text {
    margin: 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(22px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light, #000000);
  }
}
</style>
