<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { productApi } from '@/entities/product/api/product'
import type { Product } from '@/entities/product/model/types'

const products = ref<Product[]>([])
const isLoading = ref(false)

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const data = await productApi.getProducts({ page: 2 })

    console.log('data', data)

    if (data) {
      products.value = data.items
    }
  } finally {
    isLoading.value = false
  }
}

const addReview = async () => {
  const review = {
    product_id: '96e0e6a0-6d88-4c43-a87d-bd2f60112d4e',
    user_name: ' Etan Smith',
    rating: 4,
    comment: 'Great product',
    email: 'etan@gmail.com',
  }

  const reviewResult = await productApi.addReview(review)

  console.log('reviewResult', reviewResult)
}

onMounted(async () => {
  fetchProducts()
})
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="addReview">Add Review</button>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
