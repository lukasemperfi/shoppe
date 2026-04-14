<script setup lang="ts">
import type { Order } from '@/entities/order/model/types'

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'view-order', payload: { orderId: string }): void
}>()

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatMoney(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
  return `$ ${formatted}`
}

function formatStatus(value: Order['status']): string {
  const map: Record<Order['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return map[value] ?? value
}
</script>

<template>
  <article class="order-card" role="listitem" :aria-label="`Order ${props.order.order_number}`">
    <div class="order-card__row">
      <span class="order-card__label">ORDER NUMBER</span>
      <span class="order-card__value">{{ props.order.order_number }}</span>
    </div>
    <div class="order-card__row">
      <span class="order-card__label">DATE</span>
      <span class="order-card__value">{{ formatDate(props.order.created_at) }}</span>
    </div>
    <div class="order-card__row">
      <span class="order-card__label">STATUS</span>
      <span class="order-card__value">{{ formatStatus(props.order.status) }}</span>
    </div>
    <div class="order-card__row">
      <span class="order-card__label">TOTAL</span>
      <span class="order-card__value">{{ formatMoney(props.order.total_sum) }}</span>
    </div>
    <div class="order-card__row">
      <span class="order-card__label">ACTIONS</span>
      <button
        class="order-card__action"
        type="button"
        :aria-label="`View order ${props.order.order_number}`"
        @click="emit('view-order', { orderId: props.order.id })"
      >
        View Order
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.order-card {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
  line-height: 20px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 20px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  &__label {
    flex-shrink: 0;
    color: var(--light-colors-black---light);
  }

  &__value {
    text-align: right;
    color: var(--light-colors-dark-gray---light);
    word-break: break-word;
  }

  &__action {
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    font: inherit;
    line-height: 20px;
    color: var(--light-colors-accent---light);
    text-align: right;
    text-transform: none;
    background: transparent;
    border: none;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 2px;
    }
  }
}
</style>
