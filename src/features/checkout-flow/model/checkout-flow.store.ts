import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { CreateOrderRPCParams } from '@/entities/order/model/types'

export interface OrderConfirmationData {
  orderId: string | null
  payload: CreateOrderRPCParams
}

export const useCheckoutFlowStore = defineStore('checkoutFlow', () => {
  const checkoutAccessGranted = ref(false)
  const orderConfirmation = ref<OrderConfirmationData | null>(null)

  const canEnterCheckout = computed(() => checkoutAccessGranted.value === true)
  const canEnterOrderConfirmation = computed(() => orderConfirmation.value !== null)

  function grantCheckoutAccess() {
    checkoutAccessGranted.value = true
  }

  function clearCheckoutAccess() {
    checkoutAccessGranted.value = false
  }

  function setOrderConfirmation(data: OrderConfirmationData) {
    orderConfirmation.value = data
  }

  function clearOrderConfirmation() {
    orderConfirmation.value = null
  }

  function resetFlow() {
    checkoutAccessGranted.value = false
    orderConfirmation.value = null
  }

  return {
    checkoutAccessGranted,
    orderConfirmation,
    canEnterCheckout,
    canEnterOrderConfirmation,
    grantCheckoutAccess,
    clearCheckoutAccess,
    setOrderConfirmation,
    clearOrderConfirmation,
    resetFlow,
  }
})

