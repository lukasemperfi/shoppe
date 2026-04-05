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
  // {
  //   path: '/blog',
  //   name: 'blog',
  //   component: () => import('@/pages/blog/Blog.vue'),
  // },
  // {
  //   path: '/our-story',
  //   name: 'our-story',
  //   component: () => import('@/pages/our-story/OurStory.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
