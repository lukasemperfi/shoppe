<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { useMediaQuery } from '@vueuse/core'
import { onUnmounted, ref, watch } from 'vue'

type BlogMenuItem = {
  label: string
  to: string
  children?: readonly string[]
}

const blogMenuItems: readonly BlogMenuItem[] = [
  { label: 'Blog Masonry', to: '#' },
  { label: 'Blog Standard', to: '#' },
  {
    label: 'Post types',
    to: '#',
    children: ['Standard', 'No Sidebar', 'Gallery', 'Audio', 'Video'] as const,
  },
]

const isDesktop = useMediaQuery('(min-width: 769px)')
const blogMegaOpen = ref(false)

const blogMegaReferenceRef = ref<HTMLElement | null>(null)
const blogMegaFloatingRef = ref<HTMLElement | null>(null)

let blogMegaHideTimer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
  if (blogMegaHideTimer) {
    clearTimeout(blogMegaHideTimer)
    blogMegaHideTimer = null
  }
}

const openBlogMega = () => {
  clearTimer()
  if (isDesktop.value) blogMegaOpen.value = true
}

const scheduleCloseBlogMega = () => {
  clearTimer()
  blogMegaHideTimer = setTimeout(() => {
    blogMegaOpen.value = false
  }, 200)
}

const closeAll = () => {
  blogMegaOpen.value = false
  clearTimer()
}

onUnmounted(closeAll)

const { floatingStyles } = useFloating(blogMegaReferenceRef, blogMegaFloatingRef, {
  open: blogMegaOpen,
  placement: 'bottom',
  strategy: 'fixed',
  middleware: [offset(23), flip(), shift({ padding: 12 })],
  whileElementsMounted: autoUpdate,
})

watch(isDesktop, (val) => {
  if (!val) closeAll()
})
</script>

<template>
  <div class="header__blog" @mouseenter="openBlogMega" @mouseleave="scheduleCloseBlogMega">
    <div ref="blogMegaReferenceRef" class="header__blog-trigger">
      <slot />
    </div>

    <div
      v-if="blogMegaOpen && isDesktop"
      ref="blogMegaFloatingRef"
      class="header__blog-panel"
      :style="floatingStyles"
      @mouseenter="openBlogMega"
      @mouseleave="scheduleCloseBlogMega"
    >
      <ul class="header__blog-list">
        <li v-for="item in blogMenuItems" :key="item.label" class="header__blog-item">
          <template v-if="!item.children">
            <RouterLink :to="item.to" class="header__blog-link" @click="closeAll">
              {{ item.label }}
            </RouterLink>
          </template>

          <div v-else class="header__blog-sub-wrapper">
            <span class="header__blog-link header__blog-link--sub-trigger">
              {{ item.label }}
              <span class="arrow">›</span>
            </span>

            <div class="header__blog-flyout">
              <ul class="header__blog-flyout-list">
                <li v-for="sub in item.children" :key="sub">
                  <RouterLink to="#" class="header__blog-flyout-link" @click="closeAll">
                    {{ sub }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header__blog {
  position: relative;
  display: inline-flex;
}

.header__blog-panel {
  z-index: 200;
  min-width: 200px;
  padding-block: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 0;
    right: 0;
    height: 25px;
  }
}

.header__blog-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.header__blog-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  font-size: 14px;
  color: #707070;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  @media (hover: hover) {
    &:hover {
      color: #000;
      background: #f9f9f9;
    }
  }
}

.header__blog-sub-wrapper {
  position: relative;

  @media (hover: hover) {
    &:hover {
      .header__blog-flyout {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }
      .header__blog-link--sub-trigger {
        color: #000;
        background: #f9f9f9;
      }
    }
  }
}

.header__blog-flyout {
  position: absolute;
  top: -12px;
  left: 100%;

  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 201;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 100%;
  }
}

.header__blog-flyout-list {
  margin: 0;
  padding: 12px 0;
  list-style: none;
  min-width: 180px;
  background: #fff;
  border: 1px solid #e0e0e0;
}

.header__blog-flyout-link {
  display: block;
  padding: 8px 20px;
  font-size: 14px;
  color: #707070;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: #000;
      background: #f9f9f9;
    }
  }
}

.arrow {
  font-size: 18px;
  line-height: 0;
  margin-left: 10px;
}
</style>
