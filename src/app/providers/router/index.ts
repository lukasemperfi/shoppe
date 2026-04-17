import { watch } from 'vue'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { pinia } from '@/app/providers/pinia'
import { useCheckoutFlowStore } from '@/features/checkout-flow/model/checkout-flow.store'
import { useAuthStore } from '@/entities/auth/model/auth.store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/Home.vue'),
  },

  {
    path: '/auth',
    component: () => import('@/pages/auth/AuthShell.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/Login.vue'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/auth/Register.vue'),
      },
    ],
    redirect: { name: 'login' },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/pages/auth/ResetPassword.vue'),
  },
  {
    path: '/account/orders/:id',
    name: 'order',
    component: () => import('@/pages/account/Order.vue'),
  },
  {
    path: '/account',
    component: () => import('@/pages/account/AccountShell.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/account/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/account/Dashboard.vue'),
      },
      {
        path: '/account/orders',
        name: 'orders',
        component: () => import('@/pages/account/Orders.vue'),
      },
      {
        path: '/account/downloads',
        name: 'downloads',
        component: () => import('@/pages/account/Downloads.vue'),
      },
      {
        path: '/account/addresses',
        name: 'addresses',
        component: () => import('@/pages/account/Addresses.vue'),
      },
      {
        path: '/account/account-details',
        name: 'account-details',
        component: () => import('@/pages/account/AccountDetails.vue'),
      },
      {
        path: '/account/logout',
        name: 'logout',
        component: () => import('@/pages/account/Logout.vue'),
      },
    ],
    redirect: { name: 'dashboard' },
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
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/pages/wishlist/Wishlist.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/blog/Blog.vue'),
  },
  {
    path: '/blog/:id',
    name: 'blog-post',
    component: () => import('@/pages/blog-post/BlogPost.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/pages/privacy/Privacy.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/pages/contacts/Contacts.vue'),
  },
  {
    path: '/our-story',
    name: 'our-story',
    component: () => import('@/pages/our-story/OurStory.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const auth = useAuthStore(pinia)
watch(
  () => auth.isAuthed,
  (isAuthed) => {
    if (isAuthed) return

    const current = router.currentRoute.value
    const requiresAuth = current.matched.some((r) => r.meta?.requiresAuth)
    if (!requiresAuth) return

    if (current.name !== 'login') {
      void router.replace({ name: 'login' })
    }
  },
)

router.beforeEach(async (to) => {
  const flow = useCheckoutFlowStore(pinia)
  const auth = useAuthStore(pinia)

  if (!auth.isReady) {
    await auth.init()
  }

  if (to.matched.some((r) => r.meta?.requiresGuest) && auth.isAuthed) {
    return { name: 'dashboard' }
  }

  if (to.matched.some((r) => r.meta?.requiresAuth) && !auth.isAuthed) {
    return { name: 'login' }
  }

  if (to.name === 'checkout' && !flow.canEnterCheckout) {
    return { name: 'cart' }
  }

  if (to.name === 'order-confirmation' && !flow.canEnterOrderConfirmation) {
    return { name: 'cart' }
  }

  return true
})

export default router
