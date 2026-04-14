<script setup lang="ts">
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
import Input from '@/shared/ui/input/Input.vue'
import Button from '@/shared/ui/button/Button.vue'
</script>

<template>
  <div class="reset-password-page">
    <div class="app-container">
      <SectionLayout class="reset-password-page__section-layout">
        <template #content>
          <h1 class="reset-password-page__title">Have you Forgotten Your Password ?</h1>
          <p class="reset-password-page__description">
            If you've forgotten your password, enter your e-mail address and we'll send you an
            e-mail
          </p>
          <form class="reset-password-page__form">
            <Input type="email" placeholder="Email" />
            <Button type="submit" :disabled="true">Reset password</Button>
          </form>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reset-password-page {
  &__section-layout {
    max-width: 530px;
    margin-inline: auto;
  }

  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: globalFunctions.fluidValue(20px, 31px, 320px, 1440px);
    color: var(--light-colors-black---light);
    text-align: center;
    margin-bottom: globalFunctions.fluidValue(16px, 39px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      font-weight: 400;
    }
  }

  &__description {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);
    text-align: center;
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(64px, 76px, 320px, 1440px);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: globalFunctions.fluidValue(39px, 64px, 320px, 1440px);
  }
}
</style>
