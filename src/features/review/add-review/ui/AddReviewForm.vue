<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'
import StarsRate from '@/shared/ui/stars-rate/StarsRate.vue'

export type AddReviewFormValue = {
  comment: string
  name: string
  email: string
  remember: boolean
  rating: number
}

const props = withDefaults(
  defineProps<{
    modelValue?: AddReviewFormValue
    disabled?: boolean
    submitText?: string
  }>(),
  {
    disabled: false,
    submitText: 'Submit',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: AddReviewFormValue): void
  (e: 'change', value: AddReviewFormValue): void
  (e: 'submit', value: AddReviewFormValue): void
}>()

const defaultValue: AddReviewFormValue = {
  comment: '',
  name: '',
  email: '',
  remember: false,
  rating: 0,
}

const value = computed<AddReviewFormValue>({
  get() {
    return props.modelValue ?? defaultValue
  },
  set(next) {
    emit('update:modelValue', next)
    emit('change', next)
  },
})

const setField = <K extends keyof AddReviewFormValue>(key: K, next: AddReviewFormValue[K]) => {
  value.value = { ...value.value, [key]: next }
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const submit = () => {
  emit('submit', value.value)
  return value.value
}

const setValue = (patch: Partial<AddReviewFormValue>) => {
  value.value = { ...value.value, ...patch }
}

const reset = () => {
  value.value = { ...defaultValue }
}

defineExpose({
  submit,
  setValue,
  reset,
  focusComment: () => textareaRef.value?.focus(),
})
</script>

<template>
  <form class="add-review-form" @submit.prevent="submit">
    <label class="add-review-form__label add-review-form__comment">
      <span class="add-review-form__label-text">Your Review*</span>
      <textarea
        ref="textareaRef"
        class="add-review-form__textarea"
        :value="value.comment"
        :disabled="disabled"
        @input="setField('comment', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <Input
      :model-value="value.name"
      :disabled="disabled"
      placeholder="Enter your name*"
      @update:model-value="setField('name', $event ?? '')"
      class="add-review-form__name"
    />

    <Input
      :model-value="value.email"
      :disabled="disabled"
      placeholder="Enter your Email*"
      @update:model-value="setField('email', $event ?? '')"
      class="add-review-form__email"
    />

    <Checkbox
      class="add-review-form__remember"
      :model-value="value.remember"
      :disabled="disabled"
      label="Save my name, email, and website in this browser for the next time I comment"
      @update:model-value="setField('remember', $event ?? false)"
    />

    <div class="add-review-form__rating">
      <div class="add-review-form__rating-title">Your Rating*</div>
      <StarsRate
        :rate="value.rating"
        :readonly="disabled"
        @update:rate="setField('rating', $event)"
      />
    </div>

    <Button class="add-review-form__submit" type="submit" :disabled="disabled">
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
