<script setup lang="ts">
import { computed } from 'vue'
import { defineAsyncComponent } from 'vue'

interface Props {
  name: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})

const icons = import.meta.glob('@/shared/assets/icons/*.svg')

const IconComponent = computed(() => {
  const path = `/src/shared/assets/icons/${props.name}.svg`
  const loader = icons[path]

  if (!loader) {
    console.warn(`Icon "${props.name}" not found at ${path}`)
    return null
  }

  return defineAsyncComponent(loader as any)
})
</script>

<template>
  <component :is="IconComponent" v-if="IconComponent" class="icon" v-bind="$attrs" />
</template>

<style scoped>
.icon {
  display: inline-block;
  fill: currentColor;
  flex-shrink: 0;
}
</style>
