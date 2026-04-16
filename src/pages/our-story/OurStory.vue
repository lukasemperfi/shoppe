<script setup lang="ts">
import SectionLayout from '@/shared/ui/section-layout/SectionLayout.vue'
</script>

<template>
  <div class="our-story">
    <div class="app-container">
      <SectionLayout class="our-story__section">
        <template #title>Our Story</template>
        <template #header>
          <div class="our-story__subtitle">Who we are and why we do what we do!</div>
        </template>
        <template #content>
          <div class="our-story__text-block">
            <p class="our-story__paragraph">
              Duis rutrum dictum libero quis rutrum. Etiam sed neque aliquam, sollicitudin ante a,
              gravida arcu. Nam fringilla molestie velit, eget pellentesque risus scelerisque a. Nam
              ac urna maximus, tempor magna et, placerat urna. Curabitur eu magna enim. Proin
              placerat tortor lacus, ac sodales lectus placerat quis.
            </p>
          </div>
          <div class="our-story__image-block image-block">
            <div class="image-block__title">Top trends</div>
            <div class="image-block__image">
              <img src="@/shared/assets/images/blog/blog-img-1.jpg" alt="Our Story" />
            </div>
          </div>
          <div class="our-story__text-block">
            <p class="our-story__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis.
            </p>
            <ul class="our-story__list" aria-label="Cookies list">
              <li class="our-story__list-item">
                <span class="our-story__list-item-text"
                  >consectetur adipiscing elit. Aliquam placerat</span
                >
              </li>
              <li class="our-story__list-item">
                <span class="our-story__list-item-text"
                  >Lorem ipsum dolor sit amet consectetur</span
                >
              </li>
            </ul>
          </div>
          <div class="our-story__image-block image-block">
            <div class="image-block__title">Produced with care</div>
            <div class="image-block__image">
              <img src="@/shared/assets/images/blog/blog-img-2.jpg" alt="Our Story" />
            </div>
          </div>
          <div class="our-story__text-block">
            <p class="our-story__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a
              volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed
              quis mauris eget arcu facilisis consequat sed eu felis. Nunc sed porta augue. Morbi
              porta tempor odio, in molestie diam bibendu.
            </p>
          </div>
        </template>
      </SectionLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.our-story {
  &__section {
    max-width: 670px;
    margin-inline: auto;

    :deep(.section-layout__title) {
      margin-bottom: 24px;
    }
  }

  &__subtitle {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(16px, 20px, 320px, 1440px);
    text-align: center;
    color: var(--light-colors-black---light);
    margin-bottom: globalFunctions.fluidValue(24px, 46px, 320px, 1440px);

    @media (max-width: globalBreakpoints.$breakpoint-xs) {
      display: none;
    }
  }

  &__text-block {
    margin-bottom: globalFunctions.fluidValue(22px, 39px, 320px, 1440px);
  }

  &__paragraph {
    font-family: var(--font-family);
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: globalFunctions.fluidValue(20px, 27px, 320px, 1440px);
    color: var(--light-colors-black---light);
  }

  &__image-block {
    margin-bottom: globalFunctions.fluidValue(16px, 48px, 320px, 1440px);
  }

  .image-block {
    &__title {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: globalFunctions.fluidValue(16px, 26px, 320px, 1440px);
      color: var(--light-colors-black---light);
      margin-bottom: globalFunctions.fluidValue(13px, 23px, 320px, 1440px);
    }

    &__image {
      aspect-ratio: 670/300;
      border-radius: 8px;
      overflow: hidden;
      background-color: var(--light-colors-light-gray---light);

      @media (max-width: globalBreakpoints.$breakpoint-xs) {
        aspect-ratio: 288/200;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
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
    margin-top: 16px;
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
