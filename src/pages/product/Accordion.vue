<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

export type AccordionItem = {
  id: string
  title: string
  disabled?: boolean
}

type Model = string | string[] | null

const props = withDefaults(
  defineProps<{
    items: ReadonlyArray<AccordionItem>
    modelValue?: Model
    defaultValue?: Model
    multiple?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: undefined,
    defaultValue: null,
    multiple: false,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Model): void
  (e: 'change', value: Model): void
}>()

const internal = ref<Model>(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)
const value = computed<Model>(() => (isControlled.value ? props.modelValue! : internal.value))

const isOpen = (id: string) => {
  const v = value.value
  return Array.isArray(v) ? v.includes(id) : v === id
}

const setValue = (next: Model) => {
  if (!isControlled.value) internal.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

const toggle = (id: string) => {
  if (props.multiple) {
    const current = value.value
    const list = Array.isArray(current) ? [...current] : []
    const idx = list.indexOf(id)
    if (idx >= 0) list.splice(idx, 1)
    else list.push(id)
    setValue(list.length ? list : [])
    return
  }

  setValue(isOpen(id) ? null : id)
}

const panelId = (id: string) => `accordion-panel-${id}`
const triggerId = (id: string) => `accordion-trigger-${id}`

type TransitionEl = Element & { style: CSSStyleDeclaration }

const onEnter = (el: Element) => {
  const e = el as TransitionEl
  e.style.height = '0'
  e.style.opacity = '0'
  void (e as any).offsetHeight
  e.style.height = `${(el as HTMLElement).scrollHeight}px`
  e.style.opacity = '1'
}

const onAfterEnter = (el: Element) => {
  const e = el as TransitionEl
  e.style.height = 'auto'
}

const onLeave = (el: Element) => {
  const e = el as TransitionEl
  e.style.height = `${(el as HTMLElement).scrollHeight}px`
  e.style.opacity = '1'
  void (e as any).offsetHeight
  e.style.height = '0'
  e.style.opacity = '0'
}

const onAfterLeave = (el: Element) => {
  const e = el as TransitionEl
  e.style.height = ''
  e.style.opacity = ''
}
</script>

<template>
  <div class="accordion" role="region" :aria-label="ariaLabel">
    <div v-for="item in items" :key="item.id" class="accordion__item">
      <button
        :id="triggerId(item.id)"
        class="accordion__trigger"
        type="button"
        :disabled="item.disabled"
        :aria-expanded="isOpen(item.id)"
        :aria-controls="panelId(item.id)"
        @click="toggle(item.id)"
      >
        <span class="accordion__title">{{ item.title }}</span>
        <span class="accordion__chevron" :class="{ accordion__chevron_open: isOpen(item.id) }">
          <slot name="chevron" :open="isOpen(item.id)" :item="item">
            <Icon name="chevron" class="accordion__chevron-icon" aria-hidden="true" />
          </slot>
        </span>
      </button>

      <Transition
        name="accordion-panel"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div
          v-show="isOpen(item.id)"
          :id="panelId(item.id)"
          class="accordion__panel"
          role="region"
          :aria-labelledby="triggerId(item.id)"
        >
          <div class="accordion__content">
            <slot :name="item.id" :open="isOpen(item.id)" :item="item" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;

  &__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: var(--light-colors-black---light);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  }

  &__chevron {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    transition: transform 0.2s ease;

    svg {
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        width: 8px;
        height: 5px;
      }
    }
  }

  &__chevron_open {
    transform: rotateX(180deg);
  }

  &__panel {
    overflow: hidden;
    will-change: height, opacity;
    transition:
      height 0.25s ease,
      opacity 0.2s ease;
  }

  &__content {
    padding: 0 0 14px;
  }
}

.accordion-panel-enter-from,
.accordion-panel-leave-to {
  opacity: 0;
}

.accordion-panel-enter-active,
.accordion-panel-leave-active {
  overflow: hidden;
}
</style>
