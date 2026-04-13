<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
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
  'update-totals': [
    payload: {
      shippingPrice: number | null
      shippingLabel: string | null
      shippingKey: string | null
    },
  ]
  checkout: []
}>()

const accordionItems = [{ id: 'calculate-shipping', title: 'Calculate shipping' }]

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
]

const citiesByCountry: Record<string, { label: string; value: string }[]> = {
  us: [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
  ],
  uk: [{ label: 'London', value: 'london' }],
  de: [
    { label: 'Berlin', value: 'berlin' },
    { label: 'Munich', value: 'munich' },
  ],
}

const postCodeOptions = [
  { label: '10001', value: '10001' },
  { label: '90210', value: '90210' },
  { label: 'SW1A 1AA', value: 'sw1a1aa' },
]

type ShippingKey = `${string}|${string}`

const shippingRates: Partial<Record<ShippingKey, number>> = {
  'us|ny': 14.99,
  'us|la': 19.99,
  'uk|london': 9.99,
  'de|berlin': 12.99,
  'de|munich': 13.99,
}

const selectRequired = (message: string) =>
  yup
    .mixed<string | number>()
    .test('required', message, (value) => value !== '' && value !== null && value !== undefined)

const validationSchema = yup.object({
  country: selectRequired('Country is required'),
  city: selectRequired('City is required'),
  postCode: selectRequired('Post code / ZIP is required'),
})

const { defineField, errors, handleSubmit } = useForm<{
  country: string | number
  city: string | number
  postCode: string | number
}>({
  validationSchema,
  initialValues: {
    country: '',
    city: '',
    postCode: '',
  },
})

const [country] = defineField('country')
const [city] = defineField('city')
const [postCode] = defineField('postCode')

const cityOptions = computed(() => citiesByCountry[String(country.value || '').trim()] ?? [])

watch(
  () => String(country.value || '').trim(),
  () => {
    const allowed = new Set(cityOptions.value.map((c) => c.value))
    if (!allowed.has(String(city.value || '').trim())) {
      city.value = ''
    }
  },
)

const displayTotal = computed(() => props.subtotal + (shippingPrice.value ?? 0))

function formatMoney(value: number): string {
  return `$ ${value.toFixed(2).replace('.', ',')}`
}

const shippingAppliedKey = ref<ShippingKey | null>(null)
const shippingPrice = ref<number | null>(null)
const shippingLabel = ref<string | null>(null)

const shippingKey = computed<ShippingKey | null>(() => {
  const c = String(country.value || '').trim()
  const ct = String(city.value || '').trim()
  if (!c || !ct) return null
  return `${c}|${ct}` as ShippingKey
})

const isShippingStale = computed(() => {
  if (!shippingKey.value) return shippingAppliedKey.value !== null
  return shippingAppliedKey.value !== shippingKey.value
})

const shippingNote = computed(() => {
  if (shippingAppliedKey.value && shippingLabel.value) return shippingLabel.value
  return 'Shipping costs will be calculated once you have provided address.'
})

async function applyShipping(): Promise<{
  shippingPrice: number | null
  shippingLabel: string | null
  shippingKey: ShippingKey | null
}> {
  const key = shippingKey.value
  shippingAppliedKey.value = key

  if (!key) {
    shippingPrice.value = null
    shippingLabel.value = null
    return { shippingPrice: null, shippingLabel: null, shippingKey: null }
  }

  const price = shippingRates[key] ?? 0

  shippingPrice.value = price
  shippingLabel.value = `${formatMoney(price)}`
  return { shippingPrice: price, shippingLabel: shippingLabel.value, shippingKey: key }
}

const onUpdateTotals = handleSubmit(async () => {
  const payload = await applyShipping()
  emit('update-totals', payload)
})

const onCheckout = handleSubmit(async () => {
  if (isShippingStale.value) {
    await applyShipping()
  }
  emit('checkout')
})

defineExpose({
  async applyShippingIfNeeded() {
    if (!isShippingStale.value) return
    await applyShipping()
  },
})
</script>

<template>
  <section class="cart-totals" aria-labelledby="cart-totals-title">
    <h2 id="cart-totals-title" class="cart-totals__title">Cart totals</h2>

    <div class="cart-totals__row cart-totals__row_subtotal">
      <span class="cart-totals__label">Subtotal</span>
      <span class="cart-totals__value">{{ formatMoney(subtotal) }}</span>
    </div>

    <div class="cart-totals__row cart-totals__row_shipping">
      <span class="cart-totals__label">Shipping</span>
      <p class="cart-totals__shipping-note">
        {{ shippingNote }}
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
            <Select
              id="cart-totals-country"
              v-model="country"
              name="cart-shipping-country"
              class="cart-totals__select"
              label="Select a country"
              placeholder="Select a country"
              :options="countryOptions"
              :error-message="errors.country"
              error-id="cart-totals-country-error"
            />
          </div>
          <div class="cart-totals__field">
            <Select
              id="cart-totals-city"
              v-model="city"
              name="cart-shipping-city"
              class="cart-totals__select"
              label="City"
              placeholder="City"
              :options="cityOptions"
              :error-message="errors.city"
              error-id="cart-totals-city-error"
            />
          </div>
          <div class="cart-totals__field">
            <Select
              id="cart-totals-zip"
              v-model="postCode"
              name="cart-shipping-zip"
              class="cart-totals__select"
              label="Post code / ZIP"
              placeholder="Post code / ZIP"
              :options="postCodeOptions"
              :error-message="errors.postCode"
              error-id="cart-totals-zip-error"
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
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: globalFunctions.fluidValue(36px, 134px, 320px, 1440px);
  background: #ffffff;
  border-radius: 4px;
  padding-inline: globalFunctions.fluidValue(16px, 57px, 320px, 1440px);
  padding-block: globalFunctions.fluidValue(15px, 36px, 320px, 1440px);
  font-family: var(--font-family);

  @media (max-width: globalBreakpoints.$breakpoint-xs) {
    background: var(--light-colors-light-gray---light);
  }

  &__title {
    margin-bottom: globalFunctions.fluidValue(23px, 40px, 320px, 1440px);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);
    grid-column: 1 / -1;
  }

  &__row {
    display: grid;
    grid-template-columns: subgrid;

    grid-column: 1 / -1;

    &_total {
      margin-bottom: globalFunctions.fluidValue(24px, 47px, 320px, 1440px);
      margin-top: globalFunctions.fluidValue(10px, 20px, 320px, 1440px);

      .cart-totals__label,
      .cart-totals__value {
        font-weight: 700;
      }

      .cart-totals__value {
        text-align: right;
      }
    }
    &_subtotal {
      margin-bottom: globalFunctions.fluidValue(16px, 30px, 320px, 1440px);
    }
    &_shipping {
      margin-bottom: globalFunctions.fluidValue(16px, 38px, 320px, 1440px);
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
    color: var(--light-colors-dark-gray---light);
  }

  &__shipping-note {
    margin: 0;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light, #707070);
    line-height: globalFunctions.fluidValue(20px, 24px, 320px, 1440px);
  }

  &__accordion {
    margin-top: globalFunctions.fluidValue(8px, 12px, 320px, 1440px);
    grid-column: 2;

    :deep(.accordion__title) {
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    }

    :deep(svg) {
      width: 8px;
      height: 4px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(16px, 16px, 320px, 1440px);
    padding-top: globalFunctions.fluidValue(4px, 13px, 320px, 1440px);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
  }

  &__field-error {
    margin: 0;
    font-size: 10px;
    color: var(--light-colors-errors---light);
    position: absolute;
    top: 100%;
    left: 0;
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
    margin-top: globalFunctions.fluidValue(4px, 10px, 320px, 1440px);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    grid-column: 2;
  }

  &__divider {
    height: 1px;
    margin: globalFunctions.fluidValue(16px, 24px, 320px, 1440px) 0;
    background: var(--light-colors-gray---light, #d8d8d8);
    grid-column: 1 / -1;
  }

  &__checkout-btn {
    text-transform: uppercase;
    letter-spacing: 0.02em;
    grid-column: 1 / -1;
  }
}
</style>
