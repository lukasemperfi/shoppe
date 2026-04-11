import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
