import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from '@/app/providers/pinia'
import router from '@/app/providers/router'
import '@/app/styles/main.scss'
import { useAuthStore } from '@/entities/auth/model/auth.store'

const app = createApp(App)

app.use(pinia)
app.use(router)

useAuthStore().init()

app.mount('#app')
