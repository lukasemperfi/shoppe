<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { countryOptions } from '@/entities/user/model/constants'
import { userApi } from '@/entities/user/api/user'
import { useAuthStore } from '@/entities/auth/model/auth.store'
import type { Address, AddressType } from '@/entities/user/model/types'
import AddressFormSection from '@/pages/account/ui/AddressFormSection.vue'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

const isLoading = ref(false)
const savingType = ref<AddressType | null>(null)
const addresses = ref<Address[]>([])

const billingAddress = computed(
  () => addresses.value.find((a) => a.address_type === 'billing') ?? null,
)
const shippingAddress = computed(
  () => addresses.value.find((a) => a.address_type === 'shipping') ?? null,
)

const showBillingForm = ref(false)
const showShippingForm = ref(false)

async function loadAddresses(userId: string) {
  isLoading.value = true
  try {
    addresses.value = await userApi.getUserAddresses(userId)
    showBillingForm.value = !!billingAddress.value
    showShippingForm.value = !!shippingAddress.value
  } finally {
    isLoading.value = false
  }
}

async function saveAddress(addressType: AddressType, values: any) {
  const userId = authStore.user?.id
  if (!userId) return
  if (savingType.value) return

  savingType.value = addressType
  const dto = {
    user_id: userId,
    address_type: addressType,
    first_name: String(values.first_name ?? ''),
    last_name: String(values.last_name ?? ''),
    company_name: values.company_name || undefined,
    country: String(values.country),
    street_address: String(values.street_address ?? ''),
    post_code: String(values.post_code ?? ''),
    city: String(values.city ?? ''),
    phone: String(values.phone ?? ''),
    email: String(values.email ?? ''),
  }

  const existing = addresses.value.find((a) => a.address_type === addressType)
  try {
    if (existing?.id) {
      await userApi.updateAddress(existing.id, dto)
    } else {
      await userApi.createAddress(dto)
    }

    await loadAddresses(userId)

    toast.success('Address successfully updated')
  } finally {
    savingType.value = null
  }
}

function onAdd(addressType: AddressType) {
  if (addressType === 'billing') showBillingForm.value = true
  if (addressType === 'shipping') showShippingForm.value = true
}

onMounted(async () => {
  const userId = authStore.user?.id
  if (userId) await loadAddresses(userId)
})

watch(
  () => authStore.user?.id,
  async (userId) => {
    if (userId) await loadAddresses(userId)
    else {
      addresses.value = []
      showBillingForm.value = false
      showShippingForm.value = false
    }
  },
)
</script>

<template>
  <div class="address-page">
    <div class="address-page__description">
      The following addresses will be used on the checkout page by default.
    </div>
    <div class="address-page__body">
      <div class="address-page__billing-details">
        <h2 class="address-page__billing-details-title h2-title">Billing Address</h2>
        <AddressFormSection
          v-if="showBillingForm"
          form-aria-label="Billing address form"
          title="Billing Address"
          country-id="account-billing-country"
          :country-options="countryOptions"
          :address="billingAddress"
          submit-label="SAVE ADDRESS"
          :is-saving="savingType === 'billing'"
          @save="(values) => saveAddress('billing', values)"
        />

        <div v-else class="address-page__add-item add-item">
          <button class="add-item__button" :disabled="isLoading" @click="onAdd('billing')">
            Add
          </button>
          <div class="add-item__text">You have not set up this type of address yet.</div>
        </div>
      </div>
      <div class="address-page__order">
        <h2 class="address-page__order-title h2-title">Shipping Address</h2>
        <AddressFormSection
          v-if="showShippingForm"
          form-aria-label="Shipping address form"
          title="Shipping Address"
          country-id="account-shipping-country"
          :country-options="countryOptions"
          :address="shippingAddress"
          submit-label="SAVE ADDRESS"
          :is-saving="savingType === 'shipping'"
          @save="(values) => saveAddress('shipping', values)"
        />

        <div v-else class="address-page__add-item add-item">
          <button class="add-item__button" :disabled="isLoading" @click="onAdd('shipping')">
            Add
          </button>
          <div class="add-item__text">You have not set up this type of address yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-page {
  $breakpoint-md: 1024px;

  font-family: var(--font-family);

  .h2-title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(21px, 26px, 320px, 1440px);
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 31px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-align: center;
    margin-bottom: globalFunctions.fluidValue(15px, 65px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      font-weight: 400;
      text-align: left;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: globalFunctions.fluidValue(39px, 90px, 320px, 1440px);

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
    }
  }

  &__form {
    &__title {
      margin: 0 0 globalFunctions.fluidValue(18px, 28px, 320px, 1440px);
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
      color: var(--light-colors-black---light);
    }

    &__form {
      max-width: 680px;
    }
  }
  &__description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(24px, 45px, 320px, 1440px);
  }

  .add-item {
    display: flex;
    flex-direction: column;
    gap: 14px;

    &__button {
      font-family: var(--font-family);
      font-weight: 700;
      font-size: 16px;
      color: var(--light-colors-accent---light);
      text-transform: uppercase;
    }

    &__text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
    }
  }
}
</style>
