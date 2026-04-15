<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Article } from '@/entities/article/model/types'

const props = defineProps<{
  article: Article
}>()

const formattedDate = computed(() => {
  return new Date(props.article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <article class="blog-card">
    <div class="blog-card__media">
      <img
        v-if="article.featured_image"
        class="blog-card__img"
        :src="article.featured_image"
        :alt="article.title"
      />
      <div v-else class="blog-card__img-placeholder" aria-hidden="true" />
    </div>

    <div class="blog-card__body">
      <p class="blog-card__meta">{{ article.category }} — {{ formattedDate }}</p>
      <h2 class="blog-card__title">{{ article.title }}</h2>
      <p v-if="article.description" class="blog-card__excerpt">{{ article.description }}..</p>

      <RouterLink
        class="blog-card__link"
        :to="{ name: 'blog-post', params: { id: article.slug } }"
        :aria-label="`Read article: ${article.title}`"
      >
        Read More</RouterLink
      >
    </div>
  </article>
</template>

<style scoped lang="scss">
.blog-card {
  $layout-min: 320px;
  $layout-max: 1440px;

  &__media {
    width: 100%;
    aspect-ratio: 450 / 300;
    border-radius: 8px;
    overflow: hidden;
    background: #f0ece7;
    flex-shrink: 0;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &__img-placeholder {
    width: 100%;
    height: 100%;
  }

  &__body {
    padding-top: globalFunctions.fluidValue(15px, 24px, $layout-min, $layout-max);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__meta {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
    margin-bottom: globalFunctions.fluidValue(5px, 7px, $layout-min, $layout-max);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(5px, 13px, $layout-min, $layout-max);
  }

  &__excerpt {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
    margin-bottom: globalFunctions.fluidValue(15px, 23px, $layout-min, $layout-max);
  }

  &__link {
    font-family: var(--font-family);
    font-weight: 700;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-accent---light);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }
}
</style>
