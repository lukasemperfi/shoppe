<script setup lang="ts">
const model = defineModel<string | number | boolean>()

interface Props {
  value: string | number | boolean
  label?: string
  name?: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <label class="radio" :class="{ 'is-disabled': disabled }">
    <input
      type="radio"
      class="radio__input"
      :value="value"
      :name="name"
      :disabled="disabled"
      v-model="model"
    />

    <div class="radio__ui">
      <div class="radio__dot"></div>
    </div>

    <span v-if="label" class="radio__label">
      {{ label }}
    </span>
  </label>
</template>

<style lang="scss" scoped>
.radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  min-height: 27px;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.radio__ui {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #000000;
  border-radius: 50%;
  background: #ffffff;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.radio__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #000000;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46);
}

.radio__label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: #000000;
}

.radio__input:checked + .radio__ui .radio__dot {
  opacity: 1;
  transform: scale(1);
}

.radio__input:focus-visible + .radio__ui {
  outline: 2px solid #d8d8d8;
  outline-offset: 2px;
}

.radio:hover:not(.is-disabled) .radio__ui {
  border-color: #707070;
}
</style>
