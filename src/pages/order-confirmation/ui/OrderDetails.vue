<script setup lang="ts">
defineProps<{
  orderNumber: string
  email: string
  paymentMethod: string
  orderDate: string
  deliveryOptions: string
  deliveryAddress: string
  contactNumber: string
}>()
</script>

<template>
  <section class="order-details" aria-label="Order details information">
    <div class="order-details__grid">
      <div class="order-details__field order-details__field_order-number">
        <div id="order-details-order-number-label" class="order-details__label">Order number</div>
        <div class="order-details__value" aria-labelledby="order-details-order-number-label">
          {{ orderNumber }}
        </div>
      </div>

      <div class="order-details__field order-details__field_delivery-options">
        <div id="order-details-delivery-label" class="order-details__label">Delivery options</div>
        <div class="order-details__value" aria-labelledby="order-details-delivery-label">
          {{ deliveryOptions }}
        </div>
      </div>

      <div class="order-details__field order-details__field_email">
        <div id="order-details-email-label" class="order-details__label">Email</div>
        <div class="order-details__value" aria-labelledby="order-details-email-label">
          {{ email }}
        </div>
      </div>

      <div class="order-details__field order-details__field_delivery-address">
        <div id="order-details-address-label" class="order-details__label">Delivery address</div>
        <div class="order-details__value" aria-labelledby="order-details-address-label">
          {{ deliveryAddress }}
        </div>
      </div>

      <div class="order-details__field order-details__field_payment-method">
        <div id="order-details-payment-label" class="order-details__label">Payment method</div>
        <div class="order-details__value" aria-labelledby="order-details-payment-label">
          {{ paymentMethod }}
        </div>
      </div>

      <div class="order-details__field order-details__field_order-date">
        <div id="order-details-date-label" class="order-details__label">Order date</div>
        <div class="order-details__value" aria-labelledby="order-details-date-label">
          {{ orderDate }}
        </div>
      </div>

      <div class="order-details__field order-details__field_contact-number">
        <div id="order-details-contact-label" class="order-details__label">Contact number</div>
        <div class="order-details__value" aria-labelledby="order-details-contact-label">
          {{ contactNumber }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.order-details {
  $layout-min: 320px;
  $layout-max: 1440px;

  width: 100%;
  max-width: 502px;
  font-family: var(--font-family);

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    width: 100%;
    justify-content: space-between;
    grid-template-rows: repeat(4, auto);
    column-gap: globalFunctions.fluidValue(16px, 40px, $layout-min, $layout-max);
    row-gap: globalFunctions.fluidValue(24px, 39px, $layout-min, $layout-max);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(4px, 6px, $layout-min, $layout-max);
    min-width: 0;

    &_order-number {
      grid-column: 1;
      grid-row: 1;
    }

    &_delivery-options {
      grid-column: 2;
      grid-row: 1;
    }

    &_email {
      grid-column: 1;
      grid-row: 2;
    }

    &_delivery-address {
      grid-column: 2;
      grid-row: 2/4;

      .order-details__value {
        max-width: 120px;
      }
    }

    &_payment-method {
      grid-column: 1;
      grid-row: 3;
    }

    &_order-date {
      grid-column: 1;
      grid-row: 4;
    }

    &_contact-number {
      grid-column: 2;
      grid-row: 4;
    }
  }

  &__label {
    margin: 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(22px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-black---light, #000000);
    text-transform: uppercase;
  }

  &__value {
    margin: 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(14px, 16px, $layout-min, $layout-max);
    line-height: globalFunctions.fluidValue(22px, 27px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light, #707070);
    white-space: pre-line;
    word-break: break-word;
  }

  @media (max-width: globalBreakpoints.$breakpoint-xs) {
    &__grid {
      grid-template-columns: 1fr;
      grid-template-rows: none;
    }

    &__field {
      &_order-number,
      &_delivery-options,
      &_email,
      &_delivery-address,
      &_payment-method,
      &_order-date,
      &_contact-number {
        grid-column: 1;
        grid-row: auto;
      }
    }
  }
}
</style>
