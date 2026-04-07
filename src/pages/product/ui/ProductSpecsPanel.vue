<script setup lang="ts">
withDefaults(
  defineProps<{
    weight: string
    dimensions: string
    colours: string
    material: string
    weightLabel?: string
    dimensionsLabel?: string
    coloursLabel?: string
    materialLabel?: string
  }>(),
  {
    weightLabel: 'Weight:',
    dimensionsLabel: 'Dimensions:',
    coloursLabel: 'Colours:',
    materialLabel: 'Material:',
  },
)
</script>

<template>
  <div class="product-specs-panel">
    <div class="product-specs-panel__inner">
      <dl class="product-specs-panel__list">
        <div class="product-specs-panel__row">
          <dt class="product-specs-panel__key">{{ weightLabel }}</dt>
          <dd class="product-specs-panel__val">{{ weight }}</dd>
        </div>
        <div class="product-specs-panel__row">
          <dt class="product-specs-panel__key">{{ dimensionsLabel }}</dt>
          <dd class="product-specs-panel__val">{{ dimensions }}</dd>
        </div>
        <div class="product-specs-panel__row">
          <dt class="product-specs-panel__key">{{ coloursLabel }}</dt>
          <dd class="product-specs-panel__val">{{ colours }}</dd>
        </div>
        <div class="product-specs-panel__row">
          <dt class="product-specs-panel__key">{{ materialLabel }}</dt>
          <dd class="product-specs-panel__val">{{ material }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-specs-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1248px;
  width: 100%;
  color: var(--light-colors-black---light);

  @media (max-width: 959px) {
    grid-template-columns: 1fr;
  }

  &__inner {
    width: 100%;
    min-width: 0;
  }

  &__list {
    display: grid;
    gap: 10px;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      gap: 4px;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 13px;
    row-gap: 0;
    align-items: baseline;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: #000000;
  }

  &__key {
    margin: 0;
    color: inherit;
    font-weight: 400;
  }

  &__val {
    margin: 0;
    font-weight: 400;
    color: var(--light-colors-dark-gray---light);
  }
}
</style>
