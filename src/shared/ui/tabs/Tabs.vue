<script setup lang="ts">
import { provide } from 'vue'

interface Props {
  defaultTab?: string | number
}

const props = defineProps<Props>()
const activeTab = defineModel<string | number>({ default: '' })

if (props.defaultTab && !activeTab.value) {
  activeTab.value = props.defaultTab
}

const setActiveTab = (id: string | number) => {
  activeTab.value = id
}

provide('tabsContext', {
  activeTab,
  setActiveTab,
})
</script>

<template>
  <slot />
</template>
