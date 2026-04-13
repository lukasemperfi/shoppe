import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { pinia } from '@/app/providers/pinia'
import { useCheckoutFlowStore } from '@/features/checkout-flow/model/checkout-flow.store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/Home.vue'),
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/pages/shop/Shop.vue'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/pages/product/Product.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/pages/cart/Cart.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/pages/checkout/Checkout.vue'),
  },
  {
    path: '/order-confirmation',
    name: 'order-confirmation',
    component: () => import('@/pages/order-confirmation/OrderConfirmation.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const flow = useCheckoutFlowStore(pinia)

  if (to.name === 'checkout' && !flow.canEnterCheckout) {
    return { name: 'cart' }
  }

  if (to.name === 'order-confirmation' && !flow.canEnterOrderConfirmation) {
    return { name: 'cart' }
  }

  return true
})

export default router
