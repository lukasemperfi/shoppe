import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/Home.vue'),
  },
  {
    path: '/api-example',
    name: 'api-example',
    component: () => import('@/pages/api-example/ApiExample.vue'),
  },
  {
    path: '/ui-example',
    name: 'ui-example',
    component: () => import('@/pages/ui-example/UiExample.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
