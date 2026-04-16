<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="not-found__panel">
      <h1 id="not-found-title" class="not-found__title">404 ERROR</h1>
      <p class="not-found__description">
        This page not found; <br />
        back to home and start again
      </p>
      <RouterLink to="/" class="not-found__button" aria-label="Go to homepage">HOMEPAGE</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: globalFunctions.fluidValue(205px, 255px, 320px, 1440px);

  &__panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(12px, 2vw, 22px);
    width: min(436px, 100%);
    padding: clamp(18px, 3vw, 28px);
    border-radius: 4px;
    text-align: center;
    background: #ffffff;
  }

  &__title {
    margin: 0;
    font-weight: 500;
    font-size: globalFunctions.fluidValue(20px, 33px, 320px, 1440px);
    line-height: 1.3;
    color: var(--light-colors-black---light);
  }

  &__description {
    margin: 0;
    font-weight: 400;
    font-size: globalFunctions.fluidValue(12px, 20px, 320px, 1440px);
    line-height: 1.3;
    color: var(--light-colors-dark-gray---light);
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 53px;
    padding-inline: clamp(18px, 2.5vw, 28px);
    border: 1px solid var(--light-colors-black---light);
    border-radius: 4px;
    background: #ffffff;
    color: var(--light-colors-black---light);
    text-decoration: none;
    font-weight: 700;
    font-size: globalFunctions.fluidValue(12px, 16px, 320px, 1440px);
    line-height: 1.3;
    letter-spacing: 0.02em;
    user-select: none;

    &:focus-visible {
      outline: 2px solid var(--light-colors-black---light);
      outline-offset: 2px;
    }
  }
}
</style>
