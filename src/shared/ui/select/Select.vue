<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { size } from '@floating-ui/dom'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  options: Option[]
  modelValue?: string | number
  placeholder?: string
  name?: string
  label?: string
  id?: string
  errorMessage?: string
  errorId?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(reference, floating, {
  open: computed(() => isOpen.value),
  placement: 'bottom',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(8),
    flip({
      fallbackPlacements: ['top', 'bottom'],
      padding: 10,
    }),
    shift({
      padding: 10,
    }),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
        })
      },
    }),
  ],
})

const toggleSelect = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const onNativeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

onClickOutside(
  floating,
  () => {
    if (isOpen.value) isOpen.value = false
  },
  { ignore: [reference] },
)

const selectedLabel = computed(() => {
  const option = props.options.find((opt) => opt.value === props.modelValue)
  return option ? option.label : null
})
</script>

<template>
  <div class="select" ref="reference" :class="{ 'is-open': isOpen }">
    <select
      class="select__native"
      :id="id ? `${id}-native` : undefined"
      :value="modelValue"
      :name="name"
      tabindex="-1"
      aria-hidden="true"
      @change="onNativeChange"
    >
      <option value="" disabled selected v-if="placeholder">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <div
      class="select__trigger"
      :id="id"
      role="button"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-invalid="!!errorMessage"
      :aria-describedby="errorMessage ? errorId : undefined"
      @click="toggleSelect"
    >
      <span
        class="select__value"
        :class="{ 'is-placeholder': !modelValue && Boolean(label ?? placeholder) }"
      >
        {{ !modelValue ? (label ?? placeholder) : selectedLabel }}
      </span>

      <div class="select__icon" :class="{ 'is-rotated': isOpen }">
        <Icon name="chevron" />
      </div>
    </div>

    <p v-if="errorMessage" :id="errorId" class="select__error" role="alert">
      {{ errorMessage }}
    </p>

    <Teleport to="body">
      <Transition name="fade-slide">
        <ul
          v-if="isOpen"
          ref="floating"
          class="select__dropdown"
          :style="{
            ...floatingStyles,
            zIndex: 99999,
          }"
        >
          <li
            v-for="option in options"
            :key="option.value"
            class="select__option"
            :class="{ 'is-selected': option.value === modelValue }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  width: 100%;
  font-family: var(--font-family, 'DM Sans', sans-serif);
}

.select__native {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding-bottom: clamp(4px, 1.05vw, 15px);
  padding-top: 3px;
  border-bottom: 1px solid var(--light-colors-gray---light, #d8d8d8);
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--light-colors-black---light, #000000);
  }
}

.select__error {
  margin: 0;
  font-size: 10px;
  color: var(--light-colors-errors---light);
  position: absolute;
  top: 100%;
  left: 0;
}

.is-open .select__trigger {
  border-color: var(--light-colors-black---light, #000000);
}

.select__value {
  font-size: clamp(12px, 1.12vw, 16px);
  color: var(--light-colors-black---light, #000000);
  text-transform: capitalize;

  &.is-placeholder {
    font-size: clamp(12px, 1.12vw, 16px);
    color: var(--light-colors-dark-gray---light, #707070);
  }
}

.select__icon {
  display: flex;
  transition: transform 0.3s ease;
  color: #707070;

  &.is-rotated {
    transform: rotateX(180deg);
  }

  svg {
    width: 10px;
    height: 6px;
  }
}

.select__dropdown {
  margin: 0;
  padding: 8px 0;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  list-style: none;
  z-index: 100;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  max-height: 197px;
  overflow-y: auto;
}

.select__option {
  padding: 10px 16px;
  font-size: clamp(12px, 1.12vw, 16px);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &.is-selected {
    background-color: #f9f9f9;
    font-weight: 500;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
</style>
