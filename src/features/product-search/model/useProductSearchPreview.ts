import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { productApi } from '@/entities/product/api/product'
import type { Product } from '@/entities/product/model/types'

const SEARCH_DEBOUNCE_MS = 320
const SEARCH_LIMIT = 8

export function useProductSearchPreview() {
  const query = ref('')
  const items = ref<Product[]>([])
  const loading = ref(false)

  const runFetch = async (raw: string) => {
    const term = raw.trim()
    if (!term) {
      items.value = []
      loading.value = false
      return
    }
    loading.value = true
    const data = await productApi.getProducts({
      searchName: term,
      limit: SEARCH_LIMIT,
      page: 1,
    })
    items.value = data?.items ?? []
    loading.value = false
  }

  const debouncedFetch = useDebounceFn(runFetch, SEARCH_DEBOUNCE_MS)

  watch(query, (v) => {
    debouncedFetch(v)
  })

  function reset(): void {
    query.value = ''
    items.value = []
    loading.value = false
  }

  return {
    query,
    items,
    loading,
    reset,
  }
}
