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

const classes = computed(() => [
  'shoppe-btn',
  `shoppe-btn_${props.variant}`,
  `shoppe-btn_color-${props.color}`,
])
</script>

<template>
  <button :class="classes" v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use './button-mixins' as mixins;

.shoppe-btn {
  @include mixins.shoppe-button-base;

  &_primary {
    &.shoppe-btn_color-black {
      @include mixins.shoppe-variant('primary', 'black');
    }
    &.shoppe-btn_color-white {
      @include mixins.shoppe-variant('primary', 'white');
    }
  }

  &_outline {
    &.shoppe-btn_color-black {
      @include mixins.shoppe-variant('outline', 'black');
    }
    &.shoppe-btn_color-white {
      @include mixins.shoppe-variant('outline', 'white');
    }
  }

  &.full {
    width: 100%;
  }
}
</style>
