<script setup lang="ts">
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
</script>

<template>
  <div class="privacy">
    <div class="app-container">
      <SectionLayout class="privacy__section">
        <template #title> Privacy Policy </template>
        <template #content>
          <p class="privacy__description privacy__description_first">
            Duis rutrum dictum libero quis rutrum. Etiam sed neque aliquam, sollicitudin ante a,
            gravida arcu. Nam fringilla molestie velit, eget pellentesque risus scelerisque a. Nam
            ac urna maximus, tempor magna et, placerat urna. Curabitur eu magna enim. Proin placerat
            tortor lacus, ac sodales lectus placerat quis.
          </p>
          <h2 class="privacy__subtitle">Security</h2>
          <p class="privacy__description">
            Duis rutrum dictum libero quis rutrum. Etiam sed neque aliquam, sollicitudin ante a,
            gravida arcu. Nam fringilla molestie velit, eget pellentesque risus scelerisque.
          </p>
          <h2 class="privacy__subtitle">Cookies</h2>
          <ul class="privacy__list" aria-label="Cookies list">
            <li class="privacy__list-item">
              <span class="privacy__list-item-text"
                >consectetur adipiscing elit. Aliquam placerat</span
              >
            </li>
            <li class="privacy__list-item">
              <span class="privacy__list-item-text">Lorem ipsum dolor sit amet consectetur</span>
            </li>
          </ul>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.privacy {
  &__section {
    max-width: 670px;
    margin-inline: auto;
  }

  &__subtitle {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
    text-transform: capitalize;
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(13px, 24px, 320px, 1440px);
  }

  &__description {
    margin-bottom: globalFunctions.fluidValue(22px, 38px, 320px, 1440px);
  }

  &__list {
    font-family: var(--font-family);
    font-style: normal;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-black---light);
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    gap: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    ::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: var(--light-colors-black---light);
      border-radius: 50%;
      margin-right: 5px;

      @media (max-width: globalBreakpoints.$breakpoint-sm) {
        width: 6px;
        height: 6px;
      }
    }

    &-text {
      line-height: inherit;
    }
  }
}
</style>
