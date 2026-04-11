<script setup lang="ts">
import { computed, ref } from 'vue'
import Accordion from '@/shared/ui/accordion/Accordion.vue'
import Button from '@/shared/ui/button/Button.vue'
import Select from '@/shared/ui/select/Select.vue'

const props = withDefaults(
  defineProps<{
    subtotal: number
    total?: number
  }>(),
  {
    total: undefined,
  },
)

const emit = defineEmits<{
  'update-totals': []
  checkout: []
}>()

const accordionItems = [{ id: 'calculate-shipping', title: 'Calculate shipping' }]

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
]

const cityOptions = [
  { label: 'New York', value: 'ny' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'London', value: 'london' },
]

const postCodeOptions = [
  { label: '10001', value: '10001' },
  { label: '90210', value: '90210' },
  { label: 'SW1A 1AA', value: 'sw1a1aa' },
]

const country = ref<string | number>('')
const city = ref<string | number>('')
const postCode = ref<string | number>('')

const displayTotal = computed(() =>
  props.total !== undefined && props.total !== null ? props.total : props.subtotal,
)

function formatMoney(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

function onUpdateTotals() {
  emit('update-totals')
}

function onCheckout() {
  emit('checkout')
}
</script>

<template>
  <section class="cart-totals" aria-labelledby="cart-totals-title">
    <h2 id="cart-totals-title" class="cart-totals__title">Cart totals</h2>

    <div class="cart-totals__row">
      <span class="cart-totals__label">Subtotal</span>
      <span class="cart-totals__value">{{ formatMoney(subtotal) }}</span>
    </div>

    <div class="cart-totals__shipping-block">
      <div class="cart-totals__row cart-totals__row_align-start">
        <span class="cart-totals__label">Shipping</span>
        <p class="cart-totals__shipping-note">
          Shipping costs will be calculated once you have provided address.
        </p>
      </div>

      <Accordion
        class="cart-totals__accordion"
        :items="accordionItems"
        default-value="calculate-shipping"
        aria-label="Calculate shipping"
      >
        <template #calculate-shipping>
          <div class="cart-totals__form">
            <div class="cart-totals__field">
              <label class="cart-totals__field-label" for="cart-totals-country">Country</label>
              <Select
                id="cart-totals-country"
                v-model="country"
                name="cart-shipping-country"
                class="cart-totals__select"
                label="Select a country"
                placeholder="Select a country"
                :options="countryOptions"
              />
            </div>
            <div class="cart-totals__field">
              <label class="cart-totals__field-label" for="cart-totals-city">City</label>
              <Select
                id="cart-totals-city"
                v-model="city"
                name="cart-shipping-city"
                class="cart-totals__select"
                label="City"
                placeholder="City"
                :options="cityOptions"
              />
            </div>
            <div class="cart-totals__field">
              <label class="cart-totals__field-label" for="cart-totals-zip">Post code / ZIP</label>
              <Select
                id="cart-totals-zip"
                v-model="postCode"
                name="cart-shipping-zip"
                class="cart-totals__select"
                label="Post code / ZIP"
                placeholder="Post code / ZIP"
                :options="postCodeOptions"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              color="black"
              class="cart-totals__update-btn"
              aria-label="Update cart totals after shipping"
              @click="onUpdateTotals"
            >
              Update totals
            </Button>
          </div>
        </template>
      </Accordion>
    </div>

    <div class="cart-totals__divider" role="presentation" />

    <div class="cart-totals__row cart-totals__row_total">
      <span class="cart-totals__label">Total</span>
      <span class="cart-totals__value">{{ formatMoney(displayTotal) }}</span>
    </div>

    <Button
      type="button"
      variant="primary"
      color="black"
      class="cart-totals__checkout-btn full"
      aria-label="Proceed to checkout"
      @click="onCheckout"
    >
      Proceed to checkout
    </Button>
  </section>
</template>

<style scoped lang="scss">
.cart-totals {
  box-sizing: border-box;
  width: 100%;
  max-width: 580px;
  margin-left: auto;
  background: #ffffff;
  border-radius: 4px;
  padding: globalFunctions.fluidValue(24px, 40px, 320px, 1440px);
  font-family: var(--font-family);

  @media (max-width: 1300px) {
    margin-left: 0;
    max-width: none;
  }

  &__title {
    margin: 0 0 globalFunctions.fluidValue(20px, 32px, 320px, 1440px);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(18px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: globalFunctions.fluidValue(12px, 24px, 320px, 1440px);
    margin-bottom: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);

    &_align-start {
      align-items: flex-start;
    }

    &_total {
      margin-bottom: globalFunctions.fluidValue(24px, 32px, 320px, 1440px);

      .cart-totals__label,
      .cart-totals__value {
        font-weight: 700;
      }
    }
  }

  &__label {
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  &__value {
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-align: right;
  }

  &__shipping-block {
    margin-bottom: globalFunctions.fluidValue(8px, 16px, 320px, 1440px);
  }

  &__shipping-note {
    margin: 0;
    max-width: 280px;
    font-size: globalFunctions.fluidValue(11px, 14px, 320px, 1440px);
    line-height: 1.45;
    color: var(--light-colors-dark-gray---light, #707070);
    text-align: right;

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      max-width: none;
      text-align: left;
    }
  }

  &__accordion {
    margin-top: globalFunctions.fluidValue(8px, 12px, 320px, 1440px);

    :deep(.accordion__title) {
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(16px, 24px, 320px, 1440px);
    padding-top: globalFunctions.fluidValue(4px, 8px, 320px, 1440px);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__field-label {
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
    :deep(.select__value) {
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.02em;
    }
  }

  &__update-btn {
    align-self: flex-start;
    min-width: 168px;
    margin-top: globalFunctions.fluidValue(4px, 8px, 320px, 1440px);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  &__divider {
    height: 1px;
    margin: globalFunctions.fluidValue(16px, 24px, 320px, 1440px) 0;
    background: var(--light-colors-gray---light, #d8d8d8);
  }

  &__checkout-btn {
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
}
</style>
