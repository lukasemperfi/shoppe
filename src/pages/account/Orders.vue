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

const authStore = useAuthStore()
const isLoading = ref(false)
const orders = ref<Order[] | null>(null)

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
  console.log('view order', payload.orderId)
}

onMounted(async () => {
  await loadOrders()
})
</script>

<template>
  <div class="account-orders" aria-label="Orders content">
    <div v-if="isLoading" class="account-orders__loading" aria-label="Loading orders">
      <Loader />
    </div>

    <OrdersTable
      v-else-if="(orders?.length ?? 0) > 0"
      :orders="orders ?? []"
      @view-order="onViewOrder"
    />

    <Toast v-else type="success">
      <ToastWrapper>
        <ToastText>No order has been made yet.</ToastText>
        <ToastLink to="/shop">BROWSE PRODUCT</ToastLink>
      </ToastWrapper>
    </Toast>
  </div>
</template>

<style scoped lang="scss">
.account-orders {
  &__loading {
    display: flex;
    justify-content: center;
    padding: globalFunctions.fluidValue(16px, 40px, 320px, 1440px);
  }
}
</style>
