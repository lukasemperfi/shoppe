<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import Input from '@/shared/ui/input/Input.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import Pagination from '@/shared/ui/pagination/Pagination.vue'
import { articleApi } from '@/entities/article/api/article'
import type { Article, BlogCategory } from '@/entities/article/model/types'
import BlogCard from '@/pages/blog/ui/BlogCard.vue'

const ARTICLES_PER_PAGE = 4

const route = useRoute()
const router = useRouter()

const CATEGORIES: { label: string; value: BlogCategory | null }[] = [
  { label: 'All', value: null },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Style', value: 'Style' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Season', value: 'Season' },
]

const filters = reactive<{ search: string; category: BlogCategory | null }>({
  search: (route.query.search as string) || '',
  category: (route.query.category as BlogCategory) || null,
})

const appliedSearch = ref(filters.search)

const filtersPanelOpen = ref(false)
const isNarrowShopLayout = useMediaQuery('(max-width: 1024px)')
const articles = ref<Article[]>([])
const totalCount = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(totalCount.value / ARTICLES_PER_PAGE))

const syncQuery = () => {
  const query: Record<string, string> = {}
  if (filters.search) query.search = filters.search
  if (filters.category) query.category = filters.category
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.replace({ query })
}

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const data = await articleApi.getArticles({
      search: filters.search || undefined,
      category: filters.category || undefined,
      page: currentPage.value,
      limit: ARTICLES_PER_PAGE,
    })
    articles.value = data?.items ?? []
    totalCount.value = data?.totalCount ?? 0
  } catch {
    articles.value = []
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}

const onSearchSubmit = () => {
  appliedSearch.value = filters.search
  currentPage.value = 1
  syncQuery()
  fetchArticles()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  syncQuery()
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onCategorySelect = (value: BlogCategory | null) => {
  filters.category = value
  currentPage.value = 1
  syncQuery()
  fetchArticles()
}

watch(
  () => filters.search,
  (val) => {
    if (val === '' && appliedSearch.value !== '') {
      appliedSearch.value = ''
      currentPage.value = 1
      syncQuery()
      fetchArticles()
    }
  },
)

watch(isNarrowShopLayout, (narrow) => {
  if (!narrow) filtersPanelOpen.value = false
})

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <div class="blog">
    <div class="app-container">
      <div class="catalog">
        <div class="blog__top">
          <h1 class="blog__title">Blog</h1>
        </div>
        <div class="blog__body" :class="{ blog__body_filters_open: filtersPanelOpen }">
          <button
            type="button"
            class="blog__toggle-filters"
            :aria-expanded="filtersPanelOpen"
            aria-controls="catalog-filters-panel"
            @click="filtersPanelOpen = !filtersPanelOpen"
          >
            <Icon name="filter" />
            <span class="blog__toggle-filters-text"> Filters </span>
          </button>

          <aside
            id="catalog-filters-panel"
            class="blog__aside"
            :class="{ blog__aside_open: filtersPanelOpen }"
          >
            <div class="blog__aside-inner">
              <div class="filters-bar">
                <Input
                  v-model="filters.search"
                  placeholder="Search..."
                  class="filters-bar__search"
                  @keydown.enter="onSearchSubmit"
                >
                  <template #append>
                    <button type="button" aria-label="Search articles" @click="onSearchSubmit">
                      <Icon name="search" />
                    </button>
                  </template>
                </Input>
                <div class="filters-bar__categories">
                  <h2 class="filters-bar__categories-title">Categories</h2>
                  <div class="filters-bar__categories-list" role="list">
                    <div
                      v-for="cat in CATEGORIES"
                      :key="cat.label"
                      class="filters-bar__categories-item"
                      role="listitem"
                    >
                      <button
                        type="button"
                        class="filters-bar__categories-item-button"
                        :class="{
                          'filters-bar__categories-item-button_active':
                            filters.category === cat.value,
                        }"
                        :aria-pressed="filters.category === cat.value"
                        @click="onCategorySelect(cat.value)"
                      >
                        {{ cat.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div class="blog__main">
            <Loader v-if="isLoading" class="blog__loader" />

            <div v-else class="blog__posts" role="list">
              <BlogCard
                v-for="article in articles"
                :key="article.id"
                :article="article"
                role="listitem"
              />
              <div v-if="articles.length === 0" class="blog__empty">
                No articles found matching your filters.
              </div>
            </div>

            <Pagination
              v-if="totalPages > 1"
              class="blog__pagination"
              :total="totalPages"
              :current="currentPage"
              @update:current="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.blog {
  $layout-min: 320px;
  $layout-max: 1440px;
  margin-top: clamp(24px, 6.8vw, 97px);
  &__top {
    margin-bottom: clamp(16px, 2.8vw, 40px);
  }
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: clamp(20px, 2.2vw, 31px);
    color: var(--light-colors-black---light);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-weight: 400;
    }
  }
  &__body {
    display: flex;
    gap: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex-direction: column;
      gap: 0;
    }

    &_filters_open {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        gap: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);
      }
    }
  }

  &__body_filters_open &__toggle-filters {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      margin-bottom: 0;
    }
  }

  &__aside {
    flex: 0 0 262px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: none;
      width: 100%;
      display: grid;
      grid-template-rows: 0fr;
      margin-top: 0;
      transition:
        grid-template-rows 0.35s ease,
        margin-top 0.35s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &_open {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-template-rows: 1fr;
      }
    }

    &-inner {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        min-height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.28s ease;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    }
  }

  &__aside_open &__aside-inner {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      overflow: visible;
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__toggle-filters {
    display: none;
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      margin-bottom: globalFunctions.fluidValue(20px, 35px, $layout-min, $layout-max);
    }
  }

  &__toggle-filters-text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
  }

  &__main {
    flex: 1 1 948px;

    @media (max-width: globalBreakpoints.$breakpoint-md) {
      flex: 1 1 auto;
    }
  }

  .filters-bar {
    @media (max-width: globalBreakpoints.$breakpoint-md) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);
    }

    :deep(.input-wrapper) {
      padding-bottom: globalFunctions.fluidValue(6px, 10px, $layout-min, $layout-max);
      margin-bottom: globalFunctions.fluidValue(9px, 39px, $layout-min, $layout-max);

      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.input) {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);

      &::placeholder {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
        color: var(--light-colors-dark-gray---light);
      }
    }

    :deep(.filters-bar__search) {
      button {
        svg {
          width: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
          height: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
        }
      }
    }

    &__categories {
      &-title {
        font-family: var(--font-family);
        font-weight: 500;
        font-size: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
        text-transform: capitalize;
        color: var(--light-colors-black---light);
        margin-bottom: globalFunctions.fluidValue(16px, 22px, $layout-min, $layout-max);
      }
      &-list {
        display: flex;
        flex-direction: column;
        gap: globalFunctions.fluidValue(6px, 10px, $layout-min, $layout-max);
      }

      &-item-button {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
        color: var(--light-colors-dark-gray---light);
        transition: color 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }

        @media (hover: hover) {
          &:hover {
            color: var(--light-colors-black---light);
          }
        }

        &_active {
          font-weight: 500;
          color: var(--light-colors-black---light);
        }
      }
    }
  }

  &__posts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: globalFunctions.fluidValue(16px, 48px, $layout-min, $layout-max);
    row-gap: globalFunctions.fluidValue(39px, 64px, $layout-min, $layout-max);

    @media (max-width: (900px)) {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

  &__pagination {
    margin-top: globalFunctions.fluidValue(32px, 56px, $layout-min, $layout-max);
    justify-content: center;
  }
}
</style>
