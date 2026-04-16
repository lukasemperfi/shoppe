<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/shared/ui/input/Input.vue'
import Checkbox from '@/shared/ui/checkbox/Checkbox.vue'
import Icon from '@/shared/ui/icon/Icon.vue'

const email = ref('')
const isAgreed = ref(false)
</script>

<template>
  <footer class="footer">
    <div class="app-container">
      <div class="footer__wrapper">
        <div class="footer__top">
          <nav class="footer__nav">
            <RouterLink to="/contacts" class="footer__link">CONTACT</RouterLink>
            <RouterLink to="/privacy" class="footer__link">TERMS OF SERVICES</RouterLink>
            <RouterLink to="/shipping-and-returns" class="footer__link"
              >SHIPPING AND RETURNS</RouterLink
            >
          </nav>

          <div class="footer__newsletter">
            <Input v-model="email" placeholder="Give an email, get the newsletter.">
              <template #append>
                <button class="footer__submit">
                  <Icon name="long-arrow" />
                </button>
              </template>
            </Input>

            <div class="footer__agreement mobile-only">
              <Checkbox v-model="isAgreed" label="i agree to the website’s terms and conditions" />
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <div class="footer__copyright">© 2021 Shelly. Terms of use and privacy policy.</div>

          <div class="footer__socials">
            <span class="footer__socials-label mobile-only">Follow us</span>
            <div class="footer__socials-line mobile-only"></div>
            <div class="footer__icons">
              <a href="#" class="linkedin"><Icon name="linkedin" /></a>
              <a href="#" class="facebook"><Icon name="facebook" /></a>
              <a href="#" class="instagram"><Icon name="instagram" /></a>
              <a href="#" class="twitter"><Icon name="twitter" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background: var(--light-colors-white---light);
  padding-bottom: clamp(27px, 7.4vw, 107px);

  &__wrapper {
    border-top: 1px solid var(--light-colors-gray---light);
    padding-top: clamp(16px, 2.6vw, 37px);
    display: flex;
    flex-direction: column;
    gap: clamp(35px, 3.3vw, 47px);

    @media (max-width: 768px) {
      border: none;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    @media (max-width: 768px) {
      flex-direction: column-reverse;
      gap: 32px;
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 38px;
    }
  }

  &__nav {
    display: flex;
    gap: clamp(7px, 2.85vw, 41px);
    margin-top: clamp(9px, 1.2vw, 16px);

    @media (max-width: 768px) {
      flex-direction: column;
      gap: clamp(7px, 2.18vw, 41px);
    }
  }

  &__link {
    font-family: var(--font-family);
    font-size: clamp(12px, 1.12vw, 16px);
    line-height: 1.69;
    color: var(--light-colors-dark-gray---light);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s;

    &:hover {
      color: var(--light-colors-black---light);
    }
  }

  .linkedin {
    @media (max-width: 768px) {
      display: none;
    }

    svg {
      width: clamp(12px, 1.32vw, 19px);
      height: clamp(12px, 1.25vw, 18px);
    }
  }
  .facebook {
    svg {
      width: clamp(7px, 0.7vw, 10px);
      height: clamp(12px, 1.25vw, 18px);
    }
  }
  .instagram {
    svg {
      width: clamp(12px, 1.25vw, 18px);
      height: clamp(12px, 1.25vw, 18px);
      transform: translateY(1px);
    }
  }
  .twitter {
    svg {
      width: clamp(15px, 1.4vw, 20px);
      height: clamp(12px, 1.2vw, 17px);
    }
  }

  &__newsletter {
    width: clamp(288px, 27.5vw, 396px);

    :deep(.input-wrapper) {
      border-bottom: 1px solid var(--light-colors-black---light);
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__agreement {
    @media (max-width: 768px) {
      margin-top: 14px;
    }

    :deep(.checkbox) {
      @media (max-width: 768px) {
        gap: 4px;
      }

      .checkbox__label {
        letter-spacing: 0.05px;
      }
    }
  }

  &__input-wrapper {
    position: relative;
  }

  &__submit {
    cursor: pointer;
    color: var(--light-colors-dark-gray---light);

    svg {
      width: clamp(15px, 1.74vw, 25px);
      height: clamp(6px, 0.63vw, 9px);
    }
  }

  &__copyright {
    font-family: var(--font-family);
    font-size: clamp(12px, 1.12vw, 16px);
    line-height: 1.69;
    color: var(--light-colors-black---light);

    @media (max-width: 768px) {
      order: 2;
      width: 100%;
    }

    span {
      color: var(--light-colors-dark-gray---light);
    }
  }

  &__socials {
    @media (max-width: 768px) {
      display: flex;
      width: 100%;
      align-items: baseline;
    }
  }

  &__socials-line {
    @media (max-width: 768px) {
      flex-grow: 0;
      width: 47px;
      height: 1px;
      background: var(--light-colors-black---light);
      margin-left: 16px;
      margin-right: 8px;
    }
  }

  &__socials-label {
    @media (max-width: 768px) {
      font-size: 12px;
      font-family: var(--font-family);
    }
  }

  &__icons {
    display: flex;
    gap: clamp(16px, 2.1vw, 30px);
    align-items: flex-end;
    align-self: flex-end;
  }

  .mobile-only {
    display: none;

    @media (max-width: 768px) {
      display: flex;
    }
  }
}
</style>
