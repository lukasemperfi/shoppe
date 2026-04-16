<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import type { ArticleComment } from '@/entities/article/model/types'

const props = defineProps<{
  comment: ArticleComment
}>()

const displayDate = computed(() => {
  const d = new Date(props.comment.created_at)
  if (Number.isNaN(d.getTime())) return props.comment.created_at

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <article class="comment-card">
    <img
      v-if="comment.avatar"
      class="comment-card__avatar"
      :src="comment.avatar"
      :alt="`${comment.author} avatar`"
      width="70"
      height="70"
    />
    <div v-else class="comment-card__avatar comment-card__avatar_placeholder" aria-hidden="true" />

    <div class="comment-card__body">
      <div class="comment-card__header">
        <div class="comment-card__meta">
          <h3 class="comment-card__author">{{ comment.author }}</h3>
          <time class="comment-card__date" :datetime="comment.created_at">{{ displayDate }}</time>
        </div>

        <button class="comment-card__reply" type="button" aria-label="Reply to comment" disabled>
          <Icon name="curve-arrow" aria-hidden="true" />
          <span>Reply</span>
        </button>
      </div>

      <p class="comment-card__text">{{ comment.content }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
$layout-min: 320px;
$layout-max: 1440px;

.comment-card {
  display: flex;
  align-items: flex-start;
  gap: globalFunctions.fluidValue(12px, 24px, $layout-min, $layout-max);

  &__avatar {
    flex-shrink: 0;
    width: globalFunctions.fluidValue(48px, 70px, $layout-min, $layout-max);
    height: globalFunctions.fluidValue(48px, 70px, $layout-min, $layout-max);
    border-radius: 8px;
    object-fit: cover;

    &_placeholder {
      background: var(--light-colors-light-gray---light);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: globalFunctions.fluidValue(8px, 13px, $layout-min, $layout-max);
  }

  &__meta {
    display: flex;
    align-items: baseline;
    gap: globalFunctions.fluidValue(8px, 16px, $layout-min, $layout-max);
    flex-wrap: wrap;
  }

  &__author {
    margin: 0;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 20px, $layout-min, $layout-max);
    line-height: 26px;
    display: flex;
    align-items: center;
    color: var(--light-colors-black---light);
  }

  &__date {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 22px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
    white-space: nowrap;
  }

  &__reply {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
    flex-shrink: 0;
  }

  &__text {
    margin: 0;
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
  }
}
</style>
