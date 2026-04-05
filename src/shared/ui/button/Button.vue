<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from 'vue'

type ButtonVariant = 'primary' | 'outline'
type ButtonColor = 'black' | 'white'

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
  variant?: ButtonVariant
  color?: ButtonColor
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  color: 'black',
})

const classes = computed(() => ['btn', `btn_${props.variant}`, `btn_color-${props.color}`])
</script>

<template>
  <button :class="classes" v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use './button-mixins' as mixins;

.btn {
  @include mixins.shoppe-button-base;

  &_primary {
    &.btn_color-black {
      @include mixins.shoppe-variant('primary', 'black');
    }
    &.btn_color-white {
      @include mixins.shoppe-variant('primary', 'white');
    }
  }

  &_outline {
    &.btn_color-black {
      @include mixins.shoppe-variant('outline', 'black');
    }
    &.btn_color-white {
      @include mixins.shoppe-variant('outline', 'white');
    }
  }

  &.full {
    width: 100%;
  }
}
</style>
