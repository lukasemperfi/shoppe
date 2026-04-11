<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '@/shared/ui/modal/Modal.vue'
import Quantity from '@/shared/ui/quantity/Quantity.vue'
import Button from '@/shared/ui/button/Button.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import type { MiniCartLine } from './types'

const props = withDefaults(
  defineProps<{
    items: MiniCartLine[]
  }>(),
  {
    items: () => [],
  },
)

const emit = defineEmits<{
  'update:quantity': [payload: { id: string; quantity: number }]
  remove: [id: string]
}>()

const isOpen = defineModel<boolean>({ default: false })

const router = useRouter()

const itemCount = computed(() => props.items.reduce((sum, item) => sum + item.quantity, 0))

const subtotal = computed(() =>
  props.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
)

function formatPrice(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

function close(): void {
  isOpen.value = false
}

function onViewCart(): void {
  close()
  router.push({ name: 'cart' })
}

function setQuantity(id: string, quantity: number): void {
  emit('update:quantity', { id, quantity })
}

function removeLine(id: string): void {
  emit('remove', id)
}
</script>

<template>
  <Modal v-model="isOpen" variant="drawer-end">
    <div class="mini-cart__header">
      <div class="mini-cart__head">
        <button
          type="button"
          class="mini-cart__back"
          aria-label="Close shopping bag"
          @click="close"
        >
          <Icon name="chevron-left" class="mini-cart__back-icon" aria-hidden="true" />
        </button>
        <h2 id="mini-cart-title" class="mini-cart__title">Shopping bag</h2>
      </div>

      <div class="mini-cart__count" aria-live="polite">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </div>
    </div>

    <template #header-right>
      <span class="mini-cart__header-spacer" aria-hidden="true" />
    </template>

    <template #content>
      <div class="mini-cart" aria-labelledby="mini-cart-title">
        <div class="mini-cart__body">
          <ul v-if="items.length" class="mini-cart__list">
            <li v-for="item in items" :key="item.id" class="mini-cart__item">
              <div class="mini-cart-card">
                <div class="mini-cart-card__media">
                  <img
                    class="mini-cart-card__img"
                    :src="item.imageSrc"
                    :alt="item.imageAlt"
                    width="136"
                    height="136"
                  />
                </div>
                <div class="mini-cart-card__main">
                  <div class="mini-cart-card__top">
                    <div class="mini-cart-card__text">
                      <p class="mini-cart-card__name">{{ item.name }}</p>
                      <p class="mini-cart-card__variant">{{ item.variant }}</p>
                      <p class="mini-cart-card__price">{{ formatPrice(item.unitPrice) }}</p>
                    </div>
                    <button
                      type="button"
                      class="mini-cart-card__remove"
                      :aria-label="`Remove ${item.name} from bag`"
                      @click="removeLine(item.id)"
                    >
                      <Icon name="cross" class="mini-cart-card__remove-icon" aria-hidden="true" />
                    </button>
                  </div>
                  <div class="mini-cart-card__qty">
                    <span class="mini-cart-card__qty-label" :id="'qty-label-' + item.id">QTY:</span>
                    <Quantity
                      :model-value="item.quantity"
                      variant="minimal"
                      :aria-labelledby="'qty-label-' + item.id"
                      @update:model-value="(q) => setQuantity(item.id, q)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <p v-else class="mini-cart__empty">Your bag is empty.</p>
        </div>

        <footer class="mini-cart__footer">
          <div class="mini-cart__subtotal" aria-live="polite">
            <span class="mini-cart__subtotal-label">
              Subtotal ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
            </span>
            <span class="mini-cart__subtotal-value">{{ formatPrice(subtotal) }}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            color="black"
            class="full mini-cart__cta"
            @click="onViewCart"
          >
            VIEW CART
          </Button>
        </footer>
      </div>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.mini-cart {
  $padding-inline: globalFunctions.fluidValue(16px, 36px, 320px, 1440px);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
  font-family: var(--font-family);
  background: var(--light-colors-white---light);

  &__header {
    padding-inline: $padding-inline;
    padding-top: globalFunctions.fluidValue(13px, 71px, 320px, 1440px);
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-inline: $padding-inline;
    padding-top: 5px;
  }

  &__footer {
    flex-shrink: 0;
    padding-inline: $padding-inline;
    padding-bottom: 27px;
    padding-top: 24px;
    border-top: 1px solid var(--light-colors-gray---light);
    background: var(--light-colors-white---light);
  }

  &__back {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    color: var(--light-colors-black---light);
    cursor: pointer;
    transition: opacity 0.2s ease;

    @media (min-width: 769px) {
      display: none;
    }

    @media (hover: hover) {
      &:hover {
        opacity: 0.65;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--light-colors-black---light);
      outline-offset: 2px;
    }
  }

  &__back-icon {
    width: 10px;
    height: 16px;
  }

  &__header-spacer {
    display: block;
    width: 40px;
    height: 1px;

    @media (min-width: 769px) {
      display: none;
    }
  }

  :deep(.modal-header) {
    flex-direction: column;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 17px;
    position: relative;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__title {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 16px;
    line-height: 27px;
    color: var(--light-colors-black---light);
  }

  &__count {
    margin: 0;
    font-family: var(--font-family);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: var(--light-colors-dark-gray---light);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mini-cart-card {
    display: flex;
    gap: 7px;

    &__media {
      flex-shrink: 0;
    }

    &__img {
      display: block;
      width: 136px;
      height: 136px;
      object-fit: cover;
      border-radius: 4px;
    }

    &__main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__top {
      display: flex;
      gap: 8px;
      justify-content: space-between;
      align-items: flex-start;
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__name {
      margin: 0;
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-black---light);
      text-transform: capitalize;
    }

    &__variant {
      margin: 0;
      margin-top: 2px;
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
    }

    &__price {
      margin: 0;
      margin-top: 2px;
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-accent---light);
    }

    &__remove {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      margin: -6px -6px 0 0;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--light-colors-black---light);
      cursor: pointer;
      transition: opacity 0.2s ease;

      @media (hover: hover) {
        &:hover {
          opacity: 0.65;
        }
      }

      &:focus-visible {
        outline: 2px solid var(--light-colors-black---light);
        outline-offset: 2px;
      }
    }

    &__remove-icon {
      width: 7px;
      height: 8px;

      :deep(path) {
        stroke: currentColor;
      }
    }

    &__qty {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: auto;
    }

    &__qty-label {
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      color: var(--light-colors-dark-gray---light);
    }
  }

  &__empty {
    margin: 24px 0 0;
    font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
    line-height: 22px;
    color: var(--light-colors-dark-gray---light);
  }

  &__subtotal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 23px;
  }

  &__subtotal-label {
    font-weight: 500;
    font-size: 16px;
    color: var(--light-colors-black---light);
    text-transform: capitalize;
  }

  &__subtotal-value {
    font-weight: 500;
    font-size: 16px;

    color: var(--light-colors-black---light);
    text-transform: capitalize;
  }

  &__cta {
    width: 100%;
    min-height: 32px;
    padding-block: 8px;

    @media (min-width: 769px) {
      min-height: 53px;
      padding-block: 15px;
    }
  }
}
</style>
