<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useForm } from 'vee-validate'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'
import { addReviewSchema, type AddReviewFormValues } from '../model/addReview.validation'

export type { AddReviewFormValues as AddReviewFormValue } from '../model/addReview.validation'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    submitText?: string
  }>(),
  {
    disabled: false,
    submitText: 'Submit',
  },
)

const emit = defineEmits<{
  (e: 'submit', value: AddReviewFormValues): void
}>()

const isBusy = computed(() => props.disabled)
const formUid = useId()

const { defineField, errors, handleSubmit, resetForm, setFieldValue } = useForm<AddReviewFormValues>({
  validationSchema: addReviewSchema,
  initialValues: {
    comment: '',
    name: '',
    email: '',
    remember: false,
    rating: 0,
  },
})

const [comment, commentAttrs] = defineField('comment')
const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [remember] = defineField('remember')
const [rating] = defineField('rating')

const onRatingChange = (value: number) => {
  setFieldValue('rating', value, true)
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const onSubmit = handleSubmit((values) => {
  if (isBusy.value) return
  emit('submit', values)
})

const reset = () => {
  resetForm()
}

defineExpose({
  resetForm,
  reset,
  focusComment: () => textareaRef.value?.focus(),
})
</script>

<template>
  <form class="add-review-form" aria-label="Add product review" @submit.prevent="onSubmit">
    <label class="add-review-form__label add-review-form__comment" :for="`${formUid}-comment`">
      <span class="add-review-form__label-text">Your Review*</span>
      <textarea
        :id="`${formUid}-comment`"
        ref="textareaRef"
        class="add-review-form__textarea"
        v-model="comment"
        v-bind="commentAttrs"
        name="comment"
        :disabled="isBusy"
        aria-required="true"
        :aria-invalid="errors.comment ? true : undefined"
        :aria-describedby="errors.comment ? `${formUid}-comment-error` : undefined"
      />
      <p
        v-if="errors.comment"
        :id="`${formUid}-comment-error`"
        class="add-review-form__error"
        role="alert"
      >
        {{ errors.comment }}
      </p>
    </label>

    <Input
      v-model="name"
      v-bind="nameAttrs"
      name="name"
      type="text"
      autocomplete="name"
      :disabled="isBusy"
      placeholder="Enter your name*"
      :error-message="errors.name"
      aria-required="true"
      class="add-review-form__name"
    />

    <Input
      v-model="email"
      v-bind="emailAttrs"
      name="email"
      type="email"
      inputmode="email"
      autocomplete="email"
      :disabled="isBusy"
      placeholder="Enter your Email*"
      :error-message="errors.email"
      aria-required="true"
      class="add-review-form__email"
    />

    <Checkbox
      class="add-review-form__remember"
      v-model="remember"
      :disabled="isBusy"
      label="Save my name, email, and website in this browser for the next time I comment"
    />

    <div
      class="add-review-form__rating"
      role="group"
      :aria-labelledby="`${formUid}-rating-label`"
      :aria-invalid="errors.rating ? true : undefined"
      :aria-describedby="errors.rating ? `${formUid}-rating-error` : undefined"
    >
      <div :id="`${formUid}-rating-label`" class="add-review-form__rating-title">Your Rating*</div>
      <StarsRate :rate="rating" :readonly="isBusy" @update:rate="onRatingChange" />
      <p
        v-if="errors.rating"
        :id="`${formUid}-rating-error`"
        class="add-review-form__error"
        role="alert"
      >
        {{ errors.rating }}
      </p>
    </div>

    <Button class="add-review-form__submit" type="submit" :disabled="isBusy">
      {{ submitText }}
    </Button>
  </form>
</template>

<style scoped lang="scss">
.add-review-form {
  &__label {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__label-text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
  }

  &__comment {
    margin-bottom: globalFunctions.fluidValue(16px, 42px, 320px, 1440px);
  }

  &__name {
    margin-bottom: globalFunctions.fluidValue(16px, 42px, 320px, 1440px);
  }

  &__email {
    margin-bottom: globalFunctions.fluidValue(16px, 21px, 320px, 1440px);
  }

  &__textarea {
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

  :deep(.input)::placeholder {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
  }

  &__remember {
    margin-bottom: globalFunctions.fluidValue(16px, 50px, 320px, 1440px);

    :deep(.checkbox__box) {
      width: 18px;
      height: 18px;
      border-radius: 0px;

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        width: 16px;
        height: 16px;
      }
    }

    :deep(.checkbox__label) {
      font-size: globalFunctions.fluidValue(11px, 12px, 320px, 1440px);
    }
  }

  &__rating {
    margin-bottom: globalFunctions.fluidValue(16px, 42px, 320px, 1440px);
    width: globalFunctions.fluidValue(85px, 130px, 320px, 1440px);
  }

  &__rating-title {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, 320px, 1440px);
    color: var(--light-colors-dark-gray---light);
    margin-bottom: 16px;
  }

  &__submit {
    min-width: 122px;
    text-transform: capitalize;
  }
}
</style>
