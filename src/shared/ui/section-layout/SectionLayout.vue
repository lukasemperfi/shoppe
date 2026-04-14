<script setup lang="ts"></script>

<template>
  <div class="section-layout">
    <div class="app-container">
      <header v-if="$slots.title" class="section-layout__header">
        <h1 class="section-layout__title">
          <slot name="title" />
        </h1>
      </header>

      <div v-if="$slots.content" class="section-layout__content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-layout {
  padding-top: globalFunctions.fluidValue(24px, 130px, 320px, 1440px);
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(20px, 31px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-align: center;
    margin-bottom: globalFunctions.fluidValue(24px, 64px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }
}
</style>
