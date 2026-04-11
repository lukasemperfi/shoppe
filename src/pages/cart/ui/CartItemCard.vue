<script setup lang="ts">
import type { CartItem } from '@/entities/cart/model/types'
import Quantity from '@/shared/ui/quantity/Quantity.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    item: CartItem
    maxQuantity?: number
  }>(),
  {
    maxQuantity: 99,
  },
)

const quantity = defineModel<number>('quantity', { default: 1 })

const emit = defineEmits<{
  remove: [id: string]
}>()

const quantityFieldId = computed(() => `cart-item-qty-${props.item.id}`)

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

const quantityOptions = computed(() => {
  const max = Math.max(props.maxQuantity, quantity.value)
  return Array.from({ length: max }, (_, i) => i + 1)
})

function onSelectQuantity(e: Event) {
  const target = e.target as HTMLSelectElement
  quantity.value = Number.parseInt(target.value, 10)
}
</script>

<template>
  <article class="cart-item-card">
    <button
      type="button"
      class="cart-item-card__remove"
      aria-label="Remove item from cart"
      @click="emit('remove', item.id)"
    >
      <Icon name="cross" class="cart-item-card__remove-icon" aria-hidden="true" />
    </button>

    <div class="cart-item-card__media">
      <img
        class="cart-item-card__img"
        :src="item.imageSrc"
        :alt="item.imageAlt"
        width="136"
        height="136"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="cart-item-card__body">
      <div class="cart-item-card__text">
        <h2 class="cart-item-card__title">{{ item.title }}</h2>
        <p class="cart-item-card__description">{{ item.description }}</p>
        <p class="cart-item-card__price">{{ formatPrice(item.price) }}</p>
      </div>

      <div
        class="cart-item-card__quantity cart-item-card__quantity_desktop"
        role="group"
        :aria-label="`Quantity, ${item.title}`"
      >
        <Quantity :key="`quantity-${item.id}`" v-model="quantity" :max="maxQuantity" />
      </div>

      <div class="cart-item-card__quantity cart-item-card__quantity_mobile">
        <label class="cart-item-card__quantity-label" :for="quantityFieldId">Quantity</label>
        <select
          :id="quantityFieldId"
          :name="`cart-item-qty-${item.id}`"
          class="cart-item-card__select"
          :value="quantity"
          @change="onSelectQuantity"
        >
          <option v-for="n in quantityOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.cart-item-card {
  container-type: inline-size;
  container-name: cart-item;

  position: relative;
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-family);

  display: flex;

  &__remove {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    color: var(--light-colors-black---light);
    transition: opacity 0.2s ease;

    @container cart-item (max-width: 515px) {
      top: 6px;
      right: 0;
    }

    &:hover {
      opacity: 0.65;
    }

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 2px;
    }
  }

  &__remove-icon {
    width: 13px;
    height: 14px;

    @container cart-item (max-width: 515px) {
      width: 8px;
      height: 8px;
    }
  }

  &__media {
    flex-shrink: 0;
    width: 136px;
    height: 136px;
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--light-colors-light-gray---light);

    @container cart-item (max-width: 515px) {
      margin-top: 2px;
    }
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    min-width: 0;
    margin-left: 39px;

    @container cart-item (max-width: 515px) {
      grid-column: 2;
      flex-direction: column;
      width: 100%;
      margin-left: 8px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);
  }

  &__description {
    margin: 14px 0 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);

    @container cart-item (max-width: 515px) {
      margin-top: 1px;
      margin-bottom: 0;
    }
  }

  &__price {
    margin: 2px 0 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-accent---light);

    @container cart-item (max-width: 515px) {
      margin-top: 0;
      color: var(--light-colors-dark-gray---light);
    }
  }

  &__quantity {
    flex-shrink: 0;
    margin-right: 35px;

    &_desktop {
      @container cart-item (max-width: 515px) {
        display: none;
      }
    }

    &_mobile {
      display: none;
      margin-top: auto;
      padding-top: 12px;

      @container cart-item (max-width: 515px) {
        display: block;
      }
    }
  }

  &__quantity-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__select {
    box-sizing: border-box;
    width: 40px;
    height: 26px;
    padding: 0 4px;
    border: none;
    border-radius: 4px;
    background-color: var(--light-colors-light-gray---light);
    background-image: url('@/shared/assets/icons/chevron.svg');
    background-repeat: no-repeat;
    background-position: right 5px center;
    background-size: 8px 5px;
    appearance: none;
    cursor: pointer;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: 20px;
    color: var(--light-colors-dark-gray---light);
    text-align: left;

    &:focus-visible {
      outline: 2px solid var(--light-colors-accent---light);
      outline-offset: 2px;
    }
  }
}
</style>
