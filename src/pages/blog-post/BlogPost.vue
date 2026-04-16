<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'
import AddCommentForm from '@/features/article/add-comment/ui/AddCommentForm.vue'
import CommentCard from '@/entities/article/ui/comment-card/CommentCard.vue'
import type { AddCommentFormValues } from '@/features/article/add-comment/model/addComment.validation'
import type { ArticleComment } from '@/entities/article/model/types'

const onCommentSubmit = (values: AddCommentFormValues) => {
  console.log('Comment submitted:', values)
}

import imgMain from '@/shared/assets/images/blog/blog-img-1.jpg'
import imgSecondary from '@/shared/assets/images/blog/blog-img-4.jpg'

const title = 'Fast Fashion, And Faster Fashion'
const author = 'ANNY JOHNSON'
const date = 'October 8,2020'

const comments: ArticleComment[] = [
  {
    id: '1',
    author: 'Scarlet Witch',
    content:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.',
    created_at: '2020-05-06T00:00:00.000Z',
    avatar: 'https://i.pravatar.cc/70?u=1',
  },
  {
    id: '2',
    author: 'James Carter',
    content:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    created_at: '2020-06-14T00:00:00.000Z',
    avatar: 'https://i.pravatar.cc/70?u=2',
  },
  {
    id: '3',
    author: 'Olivia Bennett',
    content:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
    created_at: '2020-07-22T00:00:00.000Z',
    avatar: 'https://i.pravatar.cc/70?u=3',
  },
]
</script>

<template>
  <div class="blog-post">
    <div class="app-container">
      <article class="blog-post__post" aria-label="Blog post">
        <div class="blog-post__header">
          <h1 class="blog-post__title">
            {{ title }}
          </h1>
          <div class="blog-post__info">
            by <span class="blog-post__info-author">{{ author }}</span> —
            <span class="blog-post__info-date">{{ date }}</span>
          </div>
        </div>

        <img class="blog-post__image blog-post__image_main" :src="imgMain" alt="Blog post cover" />
        <div class="blog-post__container">
          <div class="blog-post__text blog-post__text_intro">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis. Nunc sed porta augue.
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis.
            </p>
          </div>

          <img
            class="blog-post__image blog-post__image_secondary"
            :src="imgSecondary"
            alt="Blog post illustration"
          />

          <div class="blog-post__top-trends" aria-label="Top trends">
            <h2 class="blog-post__subtitle">Top trends</h2>
            <p class="blog-post__text blog-post__text_group">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero.
            </p>
            <ul class="blog-post__list" aria-label="Top trends list">
              <li class="blog-post__list-item">
                <span class="blog-post__list-item-text"
                  >consectetur adipiscing elit. Aliquam placerat</span
                >
              </li>
              <li class="blog-post__list-item">
                <span class="blog-post__list-item-text"
                  >Lorem ipsum dolor sit amet consectetur</span
                >
              </li>
              <li class="blog-post__list-item">
                <span class="blog-post__list-item-text">sapien tortor faucibus augue</span>
              </li>
              <li class="blog-post__list-item">
                <span class="blog-post__list-item-text"
                  >a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis</span
                >
              </li>
            </ul>
          </div>

          <div class="blog-post__footer">
            <div class="post-tags" aria-label="Tags">
              <span class="post-tags__label">Tags</span>
              <span class="line" aria-hidden="true"></span>
              <span class="post-tags__value">Fashion, Style, Season</span>
            </div>

            <div class="post-tags" aria-label="Share">
              <span class="post-tags__label">Share</span>
              <span class="line" aria-hidden="true"></span>
              <div class="post-tags__icons" role="list" aria-label="Share links">
                <a
                  href="#"
                  class="post-tags__icon"
                  type="button"
                  aria-label="Share on Facebook"
                  role="listitem"
                >
                  <Icon name="facebook" />
                </a>
                <a
                  href="#"
                  class="post-tags__icon"
                  type="button"
                  aria-label="Share on Instagram"
                  role="listitem"
                >
                  <Icon name="instagram" />
                </a>
                <a
                  class="post-tags__icon"
                  type="button"
                  aria-label="Share on Twitter"
                  role="listitem"
                >
                  <Icon name="twitter" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div class="blog-post__container">
        <hr class="blog-post__divider" />
        <div class="blog-post__reply-form">
          <AddCommentForm @submit="onCommentSubmit" />
        </div>
        <div class="blog-post__comments">
          <h3 class="blog-post__comments-title">Comments(3)</h3>
          <ul class="blog-post__comments-list" aria-label="Comments list">
            <li v-for="comment in comments" :key="comment.id" class="blog-post__comments-item">
              <CommentCard :comment="comment" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$layout-min: 320px;
$layout-max: 1440px;
.blog-post {
  margin-top: clamp(24px, 6.8vw, 97px);

  &__container {
    margin-inline: auto;
    max-width: 670px;
  }

  &__header {
    text-align: center;
    margin-bottom: globalFunctions.fluidValue(24px, 43px, $layout-min, $layout-max);
  }

  &__info {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);

    &-author {
      color: var(--light-colors-black---light);
    }
  }

  &__title {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 500;
    font-size: globalFunctions.fluidValue(20px, 33px, $layout-min, $layout-max);
    text-align: center;
    text-transform: capitalize;
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(10px, 18px, $layout-min, $layout-max);
  }

  &__date {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
  }

  &__image {
    display: block;
    border-radius: 8px;
    object-fit: cover;

    &_main {
      aspect-ratio: 1248 / 646;
      margin-bottom: globalFunctions.fluidValue(16px, 64px, $layout-min, $layout-max);
      object-position: 50% 44%;

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        aspect-ratio: 288 / 192;
      }
    }

    &_secondary {
      aspect-ratio: 670 / 300;
      object-position: 50% 0%;
      margin-bottom: globalFunctions.fluidValue(13px, 48px, $layout-min, $layout-max);

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        aspect-ratio: 288 / 192;
      }
    }
  }

  &__text {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);

    &_intro {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: globalFunctions.fluidValue(26px, 58px, $layout-min, $layout-max);
    }

    &_group {
      font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
      margin-bottom: 16px;
    }
  }

  &__top-trends {
    margin-bottom: globalFunctions.fluidValue(46px, 93px, $layout-min, $layout-max);
  }

  &__subtitle {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 26px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(13px, 23px, $layout-min, $layout-max);
  }

  &__list {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(20px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    gap: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    ::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: var(--light-colors-black---light);
      border-radius: 50%;
      margin-right: 5px;

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        width: 6px;
        height: 6px;
      }
    }

    &-text {
      line-height: inherit;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__divider {
    border: 1px solid var(--light-colors-gray---light);
    margin-block: globalFunctions.fluidValue(36px, 48px, $layout-min, $layout-max);
  }

  &__comments-title {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(18px, 26px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    margin-bottom: 43px;
  }

  &__comments-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(24px, 40px, $layout-min, $layout-max);
  }

  &__comments-item {
    padding-bottom: globalFunctions.fluidValue(24px, 40px, $layout-min, $layout-max);
    border-bottom: 1px solid var(--light-colors-gray---light);

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}

.post-tags {
  display: flex;
  align-items: center;
  gap: 9px;

  &__label {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
  }

  &__value {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: globalFunctions.fluidValue(15px, 23px, $layout-min, $layout-max);
  }

  &__icon {
    :deep(svg) {
      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        height: 12px;
      }
    }
  }
}

.blog-post__reply-form {
  padding-bottom: globalFunctions.fluidValue(40px, 80px, 320px, 1440px);
}

.line {
  width: 64px;
  height: 0;
  border: 1px solid var(--light-colors-black---light);
}
</style>
