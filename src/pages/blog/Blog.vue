<script setup lang="ts">
import { onMounted, ref, watch, reactive } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useMediaQuery, useDebounceFn } from '@vueuse/core'
import Input from '@/shared/ui/input/Input.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import { articleApi } from '@/entities/article/api/article'
import type { Article } from '@/entities/article/model/types'

const route = useRoute()
const router = useRouter()

const filters = reactive({
  search: (route.query.search as string) || '',
})

const filtersPanelOpen = ref(false)
const isNarrowShopLayout = useMediaQuery('(max-width: 1024px)')
const articles = ref<Article[]>([])
const isLoading = ref(false)

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const data = await articleApi.getArticles({
      search: filters.search || undefined,
      page: 1,
      limit: 100,
    })
    articles.value = data?.items ?? []
  } catch {
    articles.value = []
  } finally {
    isLoading.value = false
  }
}

const debouncedFetchArticles = useDebounceFn(fetchArticles, 400)

watch(
  () => filters.search,
  (search) => {
    const query: Record<string, string> = {}
    if (search) query.search = search
    router.replace({ query })
    debouncedFetchArticles()
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
  <div class="blog-page">
    <div class="app-container">
      <div class="catalog">
        <div class="catalog__top">
          <h1 class="catalog__title">Blog</h1>
        </div>
        <div class="catalog__body" :class="{ catalog__body_filters_open: filtersPanelOpen }">
          <button
            type="button"
            class="catalog__toggle-filters"
            :aria-expanded="filtersPanelOpen"
            aria-controls="catalog-filters-panel"
            @click="filtersPanelOpen = !filtersPanelOpen"
          >
            <Icon name="filter" />
            <span class="catalog__toggle-filters-text"> Filters </span>
          </button>

          <aside
            id="catalog-filters-panel"
            class="catalog__aside"
            :class="{ catalog__aside_open: filtersPanelOpen }"
          >
            <div class="catalog__aside-inner">
              <div class="filters-bar">
                <Input v-model="filters.search" placeholder="Search..." class="filters-bar__search">
                  <template #append>
                    <button type="button" aria-label="Search articles" @click="fetchArticles">
                      <Icon name="search" />
                    </button>
                  </template>
                </Input>
              </div>
            </div>
          </aside>

          <div class="catalog__main">
            <Loader v-if="isLoading" class="catalog__loader" />

            <div v-else class="catalog__products" role="list">
              <article
                v-for="article in articles"
                :key="article.id"
                class="article-card"
                role="listitem"
              >
                <RouterLink
                  class="article-card__link"
                  :to="{ name: 'blog-post', params: { id: article.slug } }"
                >
                  <div
                    v-if="article.featured_image"
                    class="article-card__media"
                    aria-hidden="true"
                  >
                    <img
                      class="article-card__img"
                      :src="article.featured_image"
                      :alt="article.title"
                    />
                  </div>
                  <div
                    v-else
                    class="article-card__media article-card__media_placeholder"
                    aria-hidden="true"
                  />
                  <div class="article-card__body">
                    <span class="article-card__category">{{ article.category }}</span>
                    <h2 class="article-card__title">{{ article.title }}</h2>
                    <p class="article-card__meta">{{ article.author }}</p>
                  </div>
                </RouterLink>
              </article>
              <div v-if="articles.length === 0" class="catalog__empty">
                No articles found matching your filters.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.article-card {
  $layout-min: 320px;
  $layout-max: 1440px;

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--light-colors-black---light);
      outline-offset: 4px;
    }
  }

  &__media {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--light-colors-gray---light);

    &_placeholder {
      min-height: globalFunctions.fluidValue(120px, 200px, $layout-min, $layout-max);
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__body {
    padding-top: globalFunctions.fluidValue(12px, 20px, $layout-min, $layout-max);
    flex: 1 1 auto;
  }

  &__category {
    display: block;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(11px, 13px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: globalFunctions.fluidValue(4px, 8px, $layout-min, $layout-max);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 22px, $layout-min, $layout-max);
    line-height: 1.3;
    color: var(--light-colors-black---light);
    margin: 0 0 globalFunctions.fluidValue(8px, 12px, $layout-min, $layout-max);
  }

  &__meta {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
  }
}

.catalog {
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

    :deep(.select) {
      .select__trigger {
        border: 1px solid var(--light-colors-gray---light);
        border-radius: 4px;
        padding-block: globalFunctions.fluidValue(6px, 17px, $layout-min, $layout-max);
        padding-inline: globalFunctions.fluidValue(6px, 11px, $layout-min, $layout-max);
      }

      .select__value {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);

        color: var(--light-colors-black---light);
      }

      .select__icon {
        svg {
          width: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
          height: globalFunctions.fluidValue(6px, 8px, $layout-min, $layout-max);
        }
      }
    }

    :deep(.filters-bar__select-shop-by) {
      margin-bottom: globalFunctions.fluidValue(3px, 14px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        grid-column: 1 / -1;
      }
    }
    :deep(.filters-bar__select-sort-by) {
      margin-bottom: globalFunctions.fluidValue(10px, 43px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        grid-column: 1 / -1;
      }
    }

    :deep(.filters-bar__on-sale) {
      margin-top: globalFunctions.fluidValue(8px, 38px, $layout-min, $layout-max);
      margin-bottom: globalFunctions.fluidValue(9px, 42px, $layout-min, $layout-max);
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.filters-bar__in-stock) {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }
    }

    :deep(.toggle) {
      .toggle__text {
        font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
      }

      .toggle__switch {
        width: globalFunctions.fluidValue(30px, 33px, $layout-min, $layout-max);
        height: globalFunctions.fluidValue(18px, 20px, $layout-min, $layout-max);
      }
      .toggle__track::after {
        width: globalFunctions.fluidValue(11px, 13px, $layout-min, $layout-max);
        height: globalFunctions.fluidValue(11px, 13px, $layout-min, $layout-max);
      }
    }

    .slider {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        grid-column: 1 / -1;
      }

      &__input {
        --slider-bg: var(--light-colors-gray---light);
        --slider-connect-bg: var(--light-colors-black---light);
        --slider-connect-bg-disabled: var(--light-colors-gray);
        --slider-height: 2px;
        --slider-radius: 0px;

        --slider-handle-bg: var(--light-colors-black---light);
        --slider-handle-width: 2px;
        --slider-handle-height: 10px;
        --slider-handle-radius: 0px;
        --slider-handle-shadow: none;

        :deep(.slider-handle) {
          top: calc(
            (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 * -1
          ) !important;
        }
      }
      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: globalFunctions.fluidValue(6px, 13px, $layout-min, $layout-max);

        span {
          font-family: 'DM Sans', var(--font-family);
          font-weight: 400;
          font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
          line-height: globalFunctions.fluidValue(18px, 22px, $layout-min, $layout-max);
          color: #707070;
        }
      }
      &__filter-btn {
        font-family: 'DM Sans', var(--font-family);
        font-weight: 400;
        font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
        color: #a18a68;
        background: transparent;
        border: 0;
        padding: 0;
        cursor: pointer;
      }
    }
    :deep(.input-wrapper),
    :deep(.filters-bar__select-shop-by),
    :deep(.filters-bar__select-sort-by),
    :deep(.filters-bar__on-sale),
    :deep(.filters-bar__in-stock) {
      @media (max-width: globalBreakpoints.$breakpoint-md) {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }

  &__products {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: globalFunctions.fluidValue(16px, 24px, $layout-min, $layout-max);
    row-gap: globalFunctions.fluidValue(24px, 70px, $layout-min, $layout-max);

    @media (max-width: (600px)) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
