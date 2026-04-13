<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

interface Props {
  errorMessage?: string
  errorId?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const model = defineModel<string>()

const clearInput = () => {
  model.value = ''
}

const resolvedErrorId = computed(() => {
  if (props.errorId) return props.errorId
  const name = attrs.name
  return typeof name === 'string' && name.trim().length > 0 ? `${name}-error` : undefined
})

const resolvedAriaDescribedBy = computed(() => {
  if (props.errorMessage && resolvedErrorId.value) return resolvedErrorId.value
  const describedBy = attrs['aria-describedby']
  return typeof describedBy === 'string' ? describedBy : undefined
})
</script>

<template>
  <div class="input-wrapper">
    <input
      v-bind="$attrs"
      v-model="model"
      class="input"
      :aria-invalid="props.errorMessage ? true : undefined"
      :aria-describedby="resolvedAriaDescribedBy"
    />

    <div class="input__append">
      <button v-if="model" class="input__clear" type="button" @click="clearInput">
        <slot name="clear-icon">
          <Icon name="circle-cross" />
        </slot>
      </button>

      <slot name="append" />
    </div>

    <p v-if="props.errorMessage" :id="resolvedErrorId" class="input-wrapper__error" role="alert">
      {{ props.errorMessage }}
    </p>
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

  &__error {
    margin: 0;
    font-size: 10px;
    color: var(--light-colors-errors---light);
    position: absolute;
    top: 100%;
    left: 0;
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
