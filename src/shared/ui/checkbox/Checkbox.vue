<script setup lang="ts">
const model = defineModel<boolean>()

interface Props {
  label?: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <label class="checkbox" :class="{ 'is-disabled': disabled }">
    <input v-model="model" type="checkbox" class="checkbox__input" :disabled="disabled" />

    <div class="checkbox__box">
      <svg class="checkbox__tick" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <span v-if="label" class="checkbox__label">
      {{ label }}
    </span>
  </label>
</template>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  user-select: none;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.checkbox__input {
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

.checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  border: 1px solid var(--light-colors-dark-gray---light, #707070);
  border-radius: 2px;
  background: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox__label {
  font-family: var(--font-family, 'DM Sans', sans-serif);
  font-size: 12px;
  color: var(--light-colors-black---light, #000000);
}

.checkbox__input:checked + .checkbox__box {
  background: var(--light-colors-black---light, #000000);
  border-color: var(--light-colors-black---light, #000000);
}

.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid #d8d8d8;
  outline-offset: 2px;
}

.checkbox__tick {
  width: 8px;
  height: 8px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}

.checkbox__input:checked + .checkbox__box .checkbox__tick {
  opacity: 1;
  transform: scale(1);
}
</style>
