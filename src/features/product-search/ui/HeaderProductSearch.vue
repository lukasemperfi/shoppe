<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import Icon from '@/shared/ui/icon/Icon.vue'
import { useProductSearchPreview } from '../model/useProductSearchPreview'
import ProductSearchResultItem from './ProductSearchResultItem.vue'

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const panelId = 'header-product-search-panel'

const { query, items, loading, reset } = useProductSearchPreview()

function close(): void {
  isOpen.value = false
  reset()
}

function toggle(): void {
  isOpen.value = !isOpen.value
}

watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
  }
})

onClickOutside(rootRef, () => {
  if (isOpen.value) close()
})

useEventListener(
  () => window,
  'keydown',
  (e: KeyboardEvent) => {
    if (isOpen.value && e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  },
)
</script>

<template>
  <div ref="rootRef" class="header-product-search">
    <button
      type="button"
      class="header-product-search__trigger"
      :aria-expanded="isOpen"
      :aria-controls="panelId"
      aria-haspopup="true"
      aria-label="Search products"
      @click="toggle"
    >
      <Icon name="search" class="header-product-search__icon" aria-hidden="true" />
    </button>

    <div
      v-show="isOpen"
      :id="panelId"
      class="header-product-search__panel"
      role="region"
      aria-label="Product search"
    >
      <label class="header-product-search__field">
        <span class="header-product-search__icon-wrap" aria-hidden="true">
          <Icon name="search" class="header-product-search__field-icon" />
        </span>
        <input
          ref="inputRef"
          v-model="query"
          type="search"
          class="header-product-search__input"
          placeholder="Search products"
          autocomplete="off"
          aria-label="Search products"
        />
      </label>

      <div class="header-product-search__results" aria-live="polite">
        <p v-if="!query.trim() && !loading" class="header-product-search__hint">
          Start typing a product name.
        </p>
        <p v-else-if="loading" class="header-product-search__hint">Searching…</p>
        <p v-else-if="query.trim() && !items.length" class="header-product-search__hint">
          No products found.
        </p>
        <ul v-else-if="items.length" class="header-product-search__list">
          <li v-for="p in items" :key="p.id" class="header-product-search__item">
            <ProductSearchResultItem :product="p" @pick="close" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-product-search {
  $layout-min: 320px;
  $layout-max: 1440px;

  position: relative;
  display: inline-flex;
  align-items: center;

  &__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--light-colors-black---light);
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s ease;
    padding: 0;

    @media (hover: hover) {
      &:hover {
        opacity: 0.65;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__icon {
    display: block;
    width: globalFunctions.fluidValue(18px, 21px, $layout-min, $layout-max);
    height: globalFunctions.fluidValue(18px, 21px, $layout-min, $layout-max);
  }

  &__panel {
    position: absolute;
    top: calc(100% + globalFunctions.fluidValue(8px, 12px, $layout-min, $layout-max));
    right: 0;
    z-index: 250;
    width: min(92vw, globalFunctions.fluidValue(280px, 380px, $layout-min, $layout-max));
    padding: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    border-radius: 8px;
    background: var(--light-colors-white---light);
    border: 1px solid var(--light-colors-gray---light);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__field {
    display: flex;
    align-items: center;
    gap: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
    width: 100%;
    padding-inline: globalFunctions.fluidValue(10px, 12px, $layout-min, $layout-max);
    padding-block: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
    border-radius: 4px;
    background: var(--light-colors-light-gray---light);
    cursor: text;
  }

  &__icon-wrap {
    display: inline-flex;
    flex-shrink: 0;
    color: var(--light-colors-dark-gray---light);

    :deep(svg path) {
      fill: currentColor;
    }
  }

  &__field-icon {
    display: block;
    width: globalFunctions.fluidValue(16px, 18px, $layout-min, $layout-max);
    height: globalFunctions.fluidValue(16px, 18px, $layout-min, $layout-max);
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    outline: none;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 24px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);

    &::placeholder {
      color: var(--light-colors-dark-gray---light);
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button {
      appearance: none;
    }
  }

  &__results {
    margin-top: globalFunctions.fluidValue(10px, 14px, $layout-min, $layout-max);
    max-height: min(60vh, 360px);
    overflow-y: auto;
  }

  &__hint {
    margin: 0;
    padding: globalFunctions.fluidValue(6px, 8px, $layout-min, $layout-max);
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(13px, 14px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    margin: 0;
  }
}
</style>
