<script setup lang="ts">
import { useForm } from 'vee-validate'
import Button from '@/shared/ui/button/Button.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Input from '@/shared/ui/input/Input.vue'
import { addCommentSchema, type AddCommentFormValues } from '../model/addComment.validation'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    submitText?: string
  }>(),
  {
    disabled: false,
    submitText: 'Post Comment',
  },
)

const emit = defineEmits<{
  (e: 'submit', value: AddCommentFormValues): void
}>()

const { defineField, errors, handleSubmit, resetForm } = useForm<AddCommentFormValues>({
  validationSchema: addCommentSchema,
  initialValues: {
    name: '',
    email: '',
    website: '',
    remember: false,
    comment: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [website, websiteAttrs] = defineField('website')
const [remember] = defineField('remember')
const [comment, commentAttrs] = defineField('comment')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
  resetForm()
})

defineExpose({ resetForm })
</script>

<template>
  <section class="add-comment-form" aria-labelledby="reply-heading">
    <h2 id="reply-heading" class="add-comment-form__title">Leave a Reply</h2>
    <p class="add-comment-form__notice">
      Your email address will not be published. Required fields are marked
      <span aria-hidden="true">*</span>
    </p>

    <form
      class="add-comment-form__form"
      aria-label="Leave a reply form"
      :aria-busy="disabled"
      @submit.prevent="onSubmit"
    >
      <div class="add-comment-form__fields">
        <Input
          class="add-comment-form__field"
          placeholder="Enter your name*"
          name="name"
          autocomplete="name"
          :disabled="disabled"
          v-model="name"
          v-bind="nameAttrs"
          :error-message="errors.name"
          aria-required="true"
        />

        <Input
          class="add-comment-form__field"
          placeholder="Enter your Email*"
          name="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :disabled="disabled"
          v-model="email"
          v-bind="emailAttrs"
          :error-message="errors.email"
          aria-required="true"
        />

        <Input
          class="add-comment-form__field"
          placeholder="Enter your Website"
          name="website"
          type="url"
          inputmode="url"
          autocomplete="url"
          :disabled="disabled"
          v-model="website"
          v-bind="websiteAttrs"
          :error-message="errors.website"
        />
      </div>
      <Checkbox
        class="add-comment-form__remember"
        v-model="remember"
        :disabled="disabled"
        label="Save my name, email, and website in this browser for the next time I comment"
      />

      <label class="add-comment-form__comment-label" for="comment">
        <span class="add-comment-form__comment-label-text">Your Comment*</span>
        <textarea
          id="comment"
          class="add-comment-form__textarea"
          v-model="comment"
          v-bind="commentAttrs"
          name="comment"
          :disabled="disabled"
          aria-required="true"
          :aria-invalid="errors.comment ? true : undefined"
          :aria-describedby="errors.comment ? 'comment-error' : undefined"
        />
        <p v-if="errors.comment" id="comment-error" class="add-comment-form__error" role="alert">
          {{ errors.comment }}
        </p>
      </label>

      <Button class="add-comment-form__submit" type="submit" :disabled="disabled">
        {{ submitText }}
      </Button>
    </form>
  </section>
</template>

<style scoped lang="scss">
$layout-min: 320px;
$layout-max: 1440px;

.add-comment-form {
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(16px, 26px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(13px, 16px, $layout-min, $layout-max);
  }

  &__notice {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
    margin-bottom: globalFunctions.fluidValue(56px, 74px, $layout-min, $layout-max);
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(20px, 42px, $layout-min, $layout-max);
    margin-bottom: globalFunctions.fluidValue(20px, 30px, $layout-min, $layout-max);
  }

  &__field {
    :deep(.input)::placeholder {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
      color: var(--light-colors-dark-gray---light);
    }
  }

  &__remember {
    margin-bottom: globalFunctions.fluidValue(46px, 76px, $layout-min, $layout-max);

    :deep(.checkbox__box) {
      width: 18px;
      height: 18px;
      border-radius: 0;

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        width: 16px;
        height: 16px;
      }
    }

    :deep(.checkbox__label) {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 12px;
      color: var(--light-colors-dark-gray---light);
    }
  }

  &__comment-label {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: globalFunctions.fluidValue(20px, 63px, $layout-min, $layout-max);
  }

  &__comment-label-text {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 14px, $layout-min, $layout-max);
    color: var(--light-colors-dark-gray---light);
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
    font-size: globalFunctions.fluidValue(12px, 16px, $layout-min, $layout-max);
    color: var(--light-colors-black---light);
    resize: none;
    transition: border-color 0.3s ease;

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

  &__submit {
    align-self: flex-start;
    text-transform: uppercase;
    padding-inline: 34px;
    padding-block: 15px;
  }
}
</style>
