<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { productApi } from '@/entities/product/api/product'
import type { Product } from '@/entities/product/model/types'
import { orderApi } from '@/entities/order/api/order'
import type { CreateOrderRPCParams } from '@/entities/order/model/types'
import { authApi } from '@/entities/auth/api/auth'
import { userApi } from '@/entities/user/api/user'

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

const createOrder = async () => {
  try {
    const orderParams: CreateOrderRPCParams = {
      p_email: 'ааааааer@example.com',
      p_phone: '+38099156767',
      p_payment_method: 'card',
      p_delivery_option: 'courier',
      p_delivery_address: {
        first_name: 'somename',
        last_name: 'ииии',
        company_name: 'apple',
        country: 'usa',
        street_address: 'hz',
        post_code: 125455,
        city: 'vegas',
        phone: '+38545456545545',
        email: 'grt@gmail.com',
      },
      p_shipping_cost: 50,
      p_total_sum: 1250.5,
      p_user_id: '100df43f-d90f-49ff-a8b8-79f6e6d0a00f',
      p_items: [
        {
          product_id: 'ed388eab-461e-4179-be35-86d5ab6911eb',
          quantity: 4,
          price_at_purchase: 500.5,
        },
        {
          product_id: '2f342e1c-a841-4f81-ab06-eaa879819e70',
          quantity: 3,
          price_at_purchase: 700.0,
        },
      ],
    }

    const orderId = await orderApi.createOrder(orderParams)

    if (orderId) {
      console.log('Заказ успешно создан! ID:', orderId)
    }
  } catch (e) {
    alert('Не удалось оформить заказ. Попробуйте позже.')
  }
}

const fetchOrders = async () => {
  const data = await orderApi.getOrders('100df43f-d90f-49ff-a8b8-79f6e6d0a00f')
  console.log('orders', data)
}

const fetchOrderById = async () => {
  const data = await orderApi.getOrderById(
    'f0084b2e-b702-4f01-9374-c5eb5c39f357',
    '100df43f-d90f-49ff-a8b8-79f6e6d0a00f',
  )
  console.log('orderById', data)
}

const register = async () => {
  const data = await authApi.register({
    first_name: 'John',
    last_name: 'Doe',
    display_name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  })

  console.log('data', data)
}

const logout = async () => {
  const result = await authApi.logout()
  console.log('result', result)
}

const updateProfile = async () => {
  const userId = ''
  const data = await userApi.updateProfile('c2bb6521-a240-41ec-91c0-261e5578ee57', {
    first_name: 'You',
    last_name: 'New',
    display_name: 'wowwwooo',
    email: 'john123@example.com',
  })

  console.log('data', data)
}

const login = async () => {
  const data = await authApi.login({
    email: 'john@example.com',
    password: '123456',
  })

  console.log('data', data)
}

const createAddress = async () => {
  const data = await userApi.createAddress({
    user_id: 'd9ae661f-4835-456f-90f6-41b906dd86df',
    address_type: 'billing',
    first_name: 'John',
    last_name: 'Doe',
    company_name: 'Apple',
    country: 'usa',
    street_address: '123 Main St',
    post_code: '12345',
    city: 'Anytown',
    phone: '+38099156767',
    email: 'john@example.com',
  })

  console.log('data', data)
}

const getUserAddresses = async () => {
  const data = await userApi.getUserAddresses('d9ae661f-4835-456f-90f6-41b906dd86df')

  console.log('data', data)
}

onMounted(async () => {
  // fetchProducts()
})
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="addReview">Add Review</button>
    <button @click="createOrder" style="margin-top: 20px">Create Order</button>
    <button @click="fetchOrders" style="margin-top: 20px">Fetch Orders</button>
    <button @click="fetchOrderById" style="margin-top: 20px">Fetch Order By Id</button>
    <button @click="register" style="margin-top: 60px">Register</button>
    <button @click="logout" style="margin-top: 20px">Logout</button>
    <button @click="login" style="margin-top: 20px">Login</button>
    <button @click="updateProfile" style="margin-top: 60px">Update Profile</button>
    <button @click="createAddress" style="margin-top: 20px">Create Address</button>
    <button @click="getUserAddresses" style="margin-top: 20px">Get User Addresses</button>
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
