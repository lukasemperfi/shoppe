<script setup lang="ts">
import AppLayout from '@/app/layouts/AppLayout.vue'
import { Toaster } from 'vue-sonner'

import 'vue-sonner/style.css'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster position="bottom-right" rich-colors />
</template>
