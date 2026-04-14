<script setup lang="ts">
import Toast from '@/shared/ui/toast/Toast.vue'
import ToastLink from '@/shared/ui/toast/ToastLink.vue'
import ToastText from '@/shared/ui/toast/ToastText.vue'
import ToastWrapper from '@/shared/ui/toast/ToastWrapper.vue'
</script>

<template>
  <div class="account-orders" aria-label="Orders content">
    <Toast type="success">
      <ToastWrapper>
        <ToastText>No order has been made yet.</ToastText>
        <ToastLink to="/account/orders">BROWSE PRODUCT</ToastLink>
      </ToastWrapper>
    </Toast>
  </div>
</template>

<style scoped lang="scss">
.account-orders {
}
</style>
