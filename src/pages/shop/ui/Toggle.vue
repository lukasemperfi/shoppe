<script setup lang="ts">
type Props = {
  modelValue: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Toggle',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <label class="toggle">
    <span class="toggle__text">{{ props.label }}</span>
    <span class="toggle__switch">
      <input
        class="toggle__input"
        type="checkbox"
        :checked="props.modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="toggle__track" aria-hidden="true" />
    </span>
  </label>
</template>

<style scoped lang="scss">
.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  user-select: none;

  &__text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-black---light);
  }

  &__switch {
    position: relative;
    flex: 0 0 auto;
    width: 33.33px;
    height: 20px;
  }

  &__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    margin: 0;
    cursor: pointer;
  }

  &__track {
    position: absolute;
    inset: 0;
    background: var(--light-colors-dark-gray---light);
    border-radius: 999px;
    transition:
      background-color 0.18s ease,
      box-shadow 0.18s ease;

    &::after {
      content: '';
      position: absolute;
      width: 13.33px;
      height: 13.33px;
      left: 3.33px;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
      border-radius: 50%;
      transition: transform 0.18s ease;
    }
  }

  &__input:focus-visible + &__track {
    box-shadow: 0 0 0 3px rgba(112, 112, 112, 0.25);
  }

  &__input:checked + .toggle__track {
    background: #000000;

    &::after {
      transform: translateY(-50%) translateX(13.33px);
    }
  }
}
</style>
