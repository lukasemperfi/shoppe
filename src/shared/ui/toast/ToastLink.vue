<script setup lang="ts">
const props = defineProps<{
  to: string
}>()
</script>

<template>
  <RouterLink :to="to" class="toast__link">
    <slot />
  </RouterLink>
</template>
<style scoped lang="scss">
.toast__link {
  font-family: var(--font-family);
  font-weight: 700;
  font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  color: var(--light-colors-accent---light);
  text-transform: uppercase;

  @media (max-width: globalBreakpoints.$breakpoint-xs) {
    font-weight: 400;
  }
}
</style>
