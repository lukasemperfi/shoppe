<script setup lang="ts"></script>

<template>
  <p class="toast__text">
    <slot />
  </p>
</template>
<style scoped lang="scss">
.toast__text {
  font-weight: 400;
  font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  color: var(--light-colors-black---light, #000000);
}
</style>
