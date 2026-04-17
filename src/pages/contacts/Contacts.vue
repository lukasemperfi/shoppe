<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'

import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Select from '@/shared/ui/select/Select.vue'
import Button from '@/shared/ui/button/Button.vue'
import Input from '@/shared/ui/input/Input.vue'
import { contactsSchema, type ContactsFormValues } from './model/contacts.validation'

const options = [
  { label: 'General Inquiry', value: 'general-inquiry' },
  { label: 'Technical Support', value: 'technical-support' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Other', value: 'other' },
]

const { defineField, errors, handleSubmit, resetForm, isSubmitting } = useForm<ContactsFormValues>({
  validationSchema: contactsSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    selectedOption: '',
    message: '',
  },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [selectedOption, selectedOptionAttrs] = defineField('selectedOption')
const [message, messageAttrs] = defineField('message')

const isBusy = computed(() => Boolean(isSubmitting.value))

const sendMessage = handleSubmit((values) => {
  if (isBusy.value) return

  resetForm()
})
</script>

<template>
  <div class="contacts">
    <div class="app-container">
      <SectionLayout class="contacts__section">
        <template #title>Contact Us</template>
        <template #content>
          <p class="contacts__description">
            Say Hello send us your thoughts about our products or share your ideas with our Team!
          </p>
          <form
            class="contacts-form"
            aria-label="Contact us form"
            :aria-busy="isBusy"
            @submit.prevent="sendMessage"
          >
            <Input
              v-model="firstName"
              v-bind="firstNameAttrs"
              placeholder="First name*"
              name="firstName"
              autocomplete="given-name"
              :disabled="isBusy"
              :error-message="errors.firstName"
              aria-required="true"
            />
            <Input
              v-model="lastName"
              v-bind="lastNameAttrs"
              placeholder="Last name*"
              name="lastName"
              autocomplete="family-name"
              :disabled="isBusy"
              :error-message="errors.lastName"
              aria-required="true"
            />
            <Input
              v-model="email"
              v-bind="emailAttrs"
              placeholder="Email*"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              :disabled="isBusy"
              :error-message="errors.email"
              aria-required="true"
            />
            <Select
              :options="options"
              v-model="selectedOption"
              v-bind="selectedOptionAttrs"
              name="reason"
              placeholder="Select an option*"
              :disabled="isBusy"
              :error-message="errors.selectedOption"
              aria-required="true"
            />
            <label class="contacts-form__message-label" for="contacts-message">
              <textarea
                id="contacts-message"
                v-model="message"
                v-bind="messageAttrs"
                placeholder="Message"
                class="contacts-form__message"
                name="message"
                :disabled="isBusy"
                aria-required="true"
                :aria-invalid="errors.message ? true : undefined"
                :aria-describedby="errors.message ? 'contacts-message-error' : undefined"
              ></textarea>
              <p
                v-if="errors.message"
                id="contacts-message-error"
                class="contacts-form__error"
                role="alert"
              >
                {{ errors.message }}
              </p>
            </label>
            <Button
              type="submit"
              class="contacts-form__button"
              :disabled="isBusy"
              :aria-busy="isBusy"
            >
              Send
            </Button>
          </form>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contacts {
  &__section {
    max-width: 908px;
    margin-inline: auto;
  }

  &__description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);
    text-align: center;
    color: var(--light-colors-black---light);
    max-width: 562px;
    margin-inline: auto;
    margin-bottom: globalFunctions.fluidValue(62px, 108px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  .contacts-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: globalFunctions.fluidValue(47px, 116px, 320px, 1440px);
    row-gap: globalFunctions.fluidValue(47px, 94px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-sm) {
      grid-template-columns: 1fr;
    }

    &__message-label {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__message-label-text {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
      color: var(--light-colors-dark-gray---light);
    }

    &__message {
      width: 100%;
      min-height: 53px;
      border: none;
      border-bottom: 1px solid var(--light-colors-gray---light);
      outline: none;
      background: transparent;

      font-family: var(--font-family);
      font-weight: 400;
      font-size: clamp(12px, 1.12vw, 16px);
      color: var(--light-colors-black---light);
      resize: none;
      grid-column: 1/-1;

      &:focus {
        border-bottom-color: var(--light-colors-black---light);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    &__error {
      margin: 0;
      font-size: 10px;
      color: var(--light-colors-errors---light);
    }

    &__button {
      grid-column: 1/-1;
      max-width: 500px;
      width: 100%;
      justify-self: center;
    }
  }
}
</style>
