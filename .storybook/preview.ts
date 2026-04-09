import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createMemoryHistory, createRouter } from 'vue-router'
import '@/app/styles/main.scss'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'home', component: { template: '<div />' } }],
})

setup((app) => {
  app.use(router)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
