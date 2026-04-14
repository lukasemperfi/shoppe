<script setup lang="ts">
import type { Order } from '@/entities/order/model/types'

const props = defineProps<{
  orders: Order[]
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
  <div class="orders-table" role="table" aria-label="Orders table">
    <div class="orders-table__scroll" tabindex="0" aria-label="Scrollable orders table">
      <div class="orders-table__grid" role="rowgroup">
        <div class="orders-table__row orders-table__row_head" role="row">
          <div class="orders-table__cell orders-table__cell_head" role="columnheader">
            ORDER NUMBER
          </div>
          <div class="orders-table__cell orders-table__cell_head" role="columnheader">DATE</div>
          <div class="orders-table__cell orders-table__cell_head" role="columnheader">STATUS</div>
          <div class="orders-table__cell orders-table__cell_head" role="columnheader">TOTAL</div>
          <div class="orders-table__cell orders-table__cell_head" role="columnheader">ACTIONS</div>
        </div>

        <div v-for="order in props.orders" :key="order.id" class="orders-table__row" role="row">
          <div class="orders-table__cell" role="cell">
            {{ order.order_number }}
          </div>
          <div class="orders-table__cell" role="cell">
            {{ formatDate(order.created_at) }}
          </div>
          <div class="orders-table__cell" role="cell">
            {{ formatStatus(order.status) }}
          </div>
          <div class="orders-table__cell" role="cell">
            {{ formatMoney(order.total_sum) }}
          </div>
          <div class="orders-table__cell" role="cell">
            <button
              class="orders-table__action"
              type="button"
              :aria-label="`View order ${order.order_number}`"
              @click="emit('view-order', { orderId: order.id })"
            >
              View Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders-table {
  font-family: var(--font-family);

  &__scroll {
    overflow-x: auto;
    outline: none;

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 6px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 320fr 238fr 255fr 248fr 184fr;
  }

  &__row {
    display: grid;
    grid-template-columns: subgrid;

    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid var(--light-colors-gray---light);
    grid-column: 1/-1;

    &_head {
      padding: 0 0 16px 0;
      border-bottom: 1px solid var(--light-colors-black---light);
    }
  }

  &__cell {
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-dark-gray---light);
    white-space: nowrap;

    &_head {
      color: var(--light-colors-black---light);
    }
  }

  &__action {
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
    color: var(--light-colors-accent---light);
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 4px;
    }
  }
}
</style>
