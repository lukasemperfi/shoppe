<script setup lang="ts">
import { type InputHTMLAttributes } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

interface Props extends /* @vue-ignore */ InputHTMLAttributes {}

const props = defineProps<Props>()
const model = defineModel<string>()

const clearInput = () => {
  model.value = ''
}
</script>

<template>
  <div class="input-wrapper">
    <input v-bind="$attrs" v-model="model" class="input" />

    <div class="input__append">
      <button v-if="model" class="input__clear" type="button" @click="clearInput">
        <slot name="clear-icon">
          <Icon name="circle-cross" />
        </slot>
      </button>

      <slot name="append" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding-bottom: clamp(4px, 1.05vw, 15px);
  padding-top: 3px;
  border-bottom: 1px solid var(--light-colors-gray---light);
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: var(--light-colors-black---light);
  }
}

.input {
  $font-size-desktop: 16px;
  $font-size-mobile: 12px;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;

  font-family: var(--font-family);
  font-weight: 400;
  font-size: clamp($font-size-mobile, 1.12vw, $font-size-desktop);

  color: var(--light-colors-black---light);
  line-height: 21px;

  &::placeholder {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: clamp($font-size-mobile, 1.12vw, $font-size-desktop);

    color: var(--light-colors-dark-gray---light);
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  }
}

.input__append {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.input__clear {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  transition: opacity 0.2s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }

  svg {
    width: clamp(14px, 1.25vw, 18px);
    height: clamp(14px, 1.25vw, 18px);
  }
}
</style>
