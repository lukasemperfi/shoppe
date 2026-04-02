<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/shared/ui/icon/Icon.vue'

interface Props {
  total: number // Общее количество страниц
  current: number // Текущая страница
  siblingCount?: number // Сколько страниц показывать рядом с текущей
}

const props = withDefaults(defineProps<Props>(), {
  siblingCount: 1,
})

const emit = defineEmits(['update:current'])

const setPage = (page: number | string) => {
  if (typeof page === 'number' && page !== props.current) {
    emit('update:current', page)
  }
}

// Логика формирования массива страниц с многоточием
const paginationRange = computed(() => {
  const totalPageCount = props.total
  const siblingCount = props.siblingCount

  // 1 (current) + 2 (first/last) + 2 (siblings) + 2 (dots) = 7
  const totalPageNumbers = siblingCount + 5

  if (totalPageNumbers >= totalPageCount) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(props.current - siblingCount, 1)
  const rightSiblingIndex = Math.min(props.current + siblingCount, totalPageCount)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, '...', totalPageCount]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPageCount - rightItemCount + i + 1,
    )
    return [1, '...', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    )
    return [1, '...', ...middleRange, '...', totalPageCount]
  }

  return []
})
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      class="pagination__item pagination__btn"
      :disabled="current === 1"
      @click="setPage(current - 1)"
    >
      <Icon name="chevron-right" class="icon-flip" />
    </button>

    <template v-for="(page, index) in paginationRange" :key="index">
      <button
        v-if="page !== '...'"
        class="pagination__item"
        :class="{ 'is-active': page === current }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>

      <span v-else class="pagination__dots">
        {{ page }}
      </span>
    </template>

    <button
      class="pagination__item pagination__btn"
      :disabled="current === total"
      @click="setPage(current + 1)"
    >
      <Icon name="chevron-right" />
    </button>
  </nav>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

.pagination__item {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 0;

  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  cursor: pointer;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #000000;

  transition: all 0.2s ease;

  &:hover:not(:disabled):not(.is-active) {
    border-color: #000000;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.is-active {
    background: #000000;
    border-color: #000000;
    color: #ffffff;
    cursor: default;
  }
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 6px;
    height: 10px;
  }
}

.icon-flip {
  transform: rotate(180deg);
}

.pagination__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #707070;
}
</style>
