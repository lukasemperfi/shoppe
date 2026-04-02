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
  <div class="shoppe-input-wrapper">
    <input v-bind="$attrs" v-model="model" class="shoppe-input" />

    <div class="shoppe-input__append">
      <button v-if="model" class="shoppe-input__clear" type="button" @click="clearInput">
        <slot name="clear-icon">
          <Icon name="circle-cross" />
        </slot>
      </button>

      <slot name="append" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shoppe-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border-bottom: 1px solid var(--light-colors-gray---light);
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: var(--light-colors-black---light);
  }
}

.shoppe-input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 0;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 12px;
  text-transform: lowercase;
  color: var(--light-colors-black---light);
  line-height: 21px;

  &::placeholder {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 12px;
    text-transform: capitalize;
    color: var(--light-colors-dark-gray---light);
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  }
}

.shoppe-input__append {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.shoppe-input__clear {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
}
</style>
