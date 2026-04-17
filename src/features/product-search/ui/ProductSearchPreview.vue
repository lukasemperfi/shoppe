<script setup lang="ts">
import { computed, watch } from 'vue'
import ProductSearchResultItem from '@/features/product-search/ui/ProductSearchResultItem.vue'
import { useProductSearchPreview } from '@/features/product-search/model/useProductSearchPreview'

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  pick: []
}>()

const { query, items, loading } = useProductSearchPreview()

watch(
  model,
  (v) => {
    if (v !== query.value) query.value = v
  },
  { immediate: true },
)

watch(query, (v) => {
  if (v !== model.value) model.value = v
})

const isOpen = computed(() => model.value.trim().length > 0)
const isEmpty = computed(() => isOpen.value && !loading.value && items.value.length === 0)

function onPick(): void {
  emit('pick')
}
</script>

<template>
  <section
    v-if="isOpen"
    class="product-search-preview"
    aria-label="Search results"
    :aria-busy="loading"
  >
    <div v-if="loading" class="product-search-preview__state" role="status">Loading...</div>

    <div v-else-if="isEmpty" class="product-search-preview__state" role="status">
      No products found
    </div>

    <div v-else class="product-search-preview__list" role="listbox" aria-label="Products">
      <ProductSearchResultItem
        v-for="product in items"
        :key="product.id"
        :product="product"
        @pick="onPick"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.product-search-preview {
  $layout-min: 320px;
  $layout-max: 1440px;

  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
  padding: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
  border-radius: 8px;
  background: var(--light-colors-white---light);
  border: 1px solid var(--light-colors-gray---light);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);

  &__list {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(4px, 6px, $layout-min, $layout-max);
    max-height: min(52vh, 420px);
    overflow: auto;
  }

  &__state {
    font-family: var(--font-family);
    font-size: globalFunctions.fluidValue(13px, 14px, $layout-min, $layout-max);
    line-height: 1.35;
    color: var(--light-colors-dark-gray---light);
    padding: globalFunctions.fluidValue(8px, 10px, $layout-min, $layout-max);
  }
}
</style>
