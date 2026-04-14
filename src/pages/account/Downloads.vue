<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/entities/auth/model/auth.store'
import { orderApi } from '@/entities/order/api/order'
import type { Order } from '@/entities/order/model/types'
import Toast from '@/shared/ui/toast/Toast.vue'
import ToastLink from '@/shared/ui/toast/ToastLink.vue'
import ToastText from '@/shared/ui/toast/ToastText.vue'
import ToastWrapper from '@/shared/ui/toast/ToastWrapper.vue'
import Loader from '@/shared/ui/loader/Loader.vue'
import OrdersTable from '@/entities/order/ui/orders-table/OrdersTable.vue'
import OrderCard from '@/entities/order/ui/order-card/OrderCard.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const isLoading = ref(false)
const orders = ref<Order[] | null>(null)
const router = useRouter()
async function loadOrders() {
  const userId = authStore.user?.id

  console.log('userId', userId)
  if (!userId) {
    orders.value = []
    return
  }

  isLoading.value = true
  try {
    orders.value = await orderApi.getOrders(userId)

    console.log('orders', orders.value)
  } finally {
    isLoading.value = false
  }
}

function onViewOrder(payload: { orderId: string }) {
  router.push(`/account/orders/${payload.orderId}`)
}

onMounted(async () => {
  await loadOrders()
})
</script>

<template>
  <div class="account-downloads" aria-label="Orders content">
    <div v-if="isLoading" class="account-downloads__loading" aria-label="Loading orders">
      <Loader />
    </div>

    <div
      v-else-if="(orders?.length ?? 0) > 0"
      class="account-downloads__orders"
      aria-label="Your orders"
    >
      <OrdersTable
        class="account-downloads__table"
        :orders="orders ?? []"
        @view-order="onViewOrder"
        show-download-button
      />
      <div class="account-downloads__cards" role="list">
        <OrderCard
          v-for="order in orders ?? []"
          :key="order.id"
          class="account-downloads__cards-item"
          :order="order"
          @view-order="onViewOrder"
          show-download-button
        />
      </div>
    </div>

    <Toast v-else type="success">
      <ToastWrapper>
        <ToastText>No order has been made yet.</ToastText>
        <ToastLink to="/shop">BROWSE PRODUCT</ToastLink>
      </ToastWrapper>
    </Toast>
  </div>
</template>

<style scoped lang="scss">
.account-downloads {
  &__loading {
    display: flex;
    justify-content: center;
    padding: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
  }

  &__orders {
    width: 100%;
  }

  &__table {
    display: block;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__cards {
    display: none;

    @media (max-width: 1024px) {
      display: block;
      width: 100%;
    }
  }

  &__cards-item {
    justify-self: center;
    width: 100%;
    border-bottom: 1px solid var(--light-colors-gray---light);
    padding-block: 39px;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}
</style>
