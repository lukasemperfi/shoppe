<script setup lang="ts"></script>

<template>
  <div class="toast-wrapper">
    <slot />
  </div>
</template>
<style scoped lang="scss">
.toast-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}
</style>
