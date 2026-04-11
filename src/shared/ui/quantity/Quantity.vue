<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  min?: number
  max?: number
  step?: number
  variant?: 'default' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 99,
  step: 1,
  variant: 'default',
})

const model = defineModel<number>({ required: true })

const inputValue = ref(model.value.toString())

watch(model, (newVal) => {
  inputValue.value = newVal.toString()
})

const validateAndApply = (val: string) => {
  let num = parseInt(val, 10)

  if (isNaN(num)) num = props.min
  if (num < props.min) num = props.min
  if (num > props.max) num = props.max

  model.value = num
  inputValue.value = num.toString()
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const cleaned = target.value.replace(/\D/g, '')
  inputValue.value = cleaned
}

const handleBlur = () => {
  validateAndApply(inputValue.value)
}

const handlePaste = (e: ClipboardEvent) => {
  const pasteData = e.clipboardData?.getData('text') || ''
  if (/\D/.test(pasteData)) {
    e.preventDefault()
    validateAndApply(inputValue.value)
  }
}

const increment = () => {
  if (model.value < props.max) {
    validateAndApply((model.value + props.step).toString())
  }
}

const decrement = () => {
  if (model.value > props.min) {
    validateAndApply((model.value - props.step).toString())
  }
}
</script>

<template>
  <div class="quantity" :class="{ 'quantity_minimal': props.variant === 'minimal' }">
    <button type="button" class="quantity__btn" @click="decrement" :disabled="model <= min">
      &minus;
    </button>

    <input
      type="text"
      class="quantity__input"
      v-model="inputValue"
      @input="handleInput"
      @blur="handleBlur"
      @paste="handlePaste"
      inputmode="numeric"
    />

    <button type="button" class="quantity__btn" @click="increment" :disabled="model >= max">
      &#43;
    </button>
  </div>
</template>

<style lang="scss" scoped>
.quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 102px;
  height: 53px;
  background: var(--light-colors-light-gray---light);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 12px;
  user-select: none;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
    transition: opacity 0.2s ease;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &:active:not(:disabled) {
      opacity: 0.6;
    }
  }

  &__input {
    width: 34px;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;

    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
  }

  &_minimal {
    width: auto;
    height: 22px;
    min-height: 22px;
    background: transparent;
    padding: 0;
    gap: 6px;
    justify-content: flex-start;

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      height: 20px;
      min-height: 20px;
      gap: 4px;
    }

    .quantity__btn {
      width: auto;
      min-width: 8px;
      height: 100%;
      font-size: 14px;
      line-height: 22px;

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        font-size: 12px;
        line-height: 20px;
      }
    }

    .quantity__input {
      width: auto;
      min-width: 10px;
      max-width: 28px;
      font-size: 14px;
      line-height: 22px;

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
