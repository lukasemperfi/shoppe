<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
</script>
<template>
  <div>
    <h1>UI Example</h1>
    <Icon name="logo" />
    <Icon name="twitter" />
    <Button variant="primary" class="full">Primary</Button>
    <Button variant="outline">Outline</Button>
    <div style="background-color: black; padding: 20px; margin-top: 20px">
      <Button variant="outline" color="white" class="full">Outline</Button>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
