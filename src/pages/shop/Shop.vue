<script setup lang="ts">
import Input from '@/shared/ui/input/Input.vue'
import Icon from '@/shared/ui/icon/Icon.vue'
import Select from '@/shared/ui/select/Select.vue'
import Toggle from './Toggle.vue'
import { ref, watch } from 'vue'

const shopByCategory = ref<string>('')
const sortBy = ref<string>('')
const onSale = ref(false)
const inStock = ref(false)
const shopByCategoryOptions = [
  { label: 'All', value: 'all' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Shoes', value: 'shoes' },
]
const sortByOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: Low to High', value: 'price_low_to_high' },
  { label: 'Price: High to Low', value: 'price_high_to_low' },
]

watch(onSale, (newVal) => {
  console.log(newVal)
})
</script>
<template>
  <div class="shop">
    <div class="app-container">
      <div class="catalog">
        <div class="catalog__top">
          <h1 class="catalog__title">Shop The Latest</h1>
        </div>
        <div class="catalog__body">
          <div class="catalog__aside">
            <div class="filters-bar">
              <Input placeholder="Search..." class="filters-bar__search">
                <template #append>
                  <button type="button" style="">
                    <Icon name="search" />
                  </button>
                </template>
              </Input>
              <Select
                :options="shopByCategoryOptions"
                v-model="shopByCategory"
                label="Shop by"
                class="filters-bar__select-shop-by"
              />
              <Select
                :options="sortByOptions"
                v-model="sortBy"
                label="Sort by"
                class="filters-bar__select-sort-by"
              />
              <Toggle v-model="onSale" class="filters-bar__on-sale" label="On sale" />
              <Toggle v-model="inStock" class="filters-bar__in-stock" label="In stock" />
            </div>
          </div>
          <div class="catalog__main">
            <div class="catalog__products">Products</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.catalog {
  margin-top: 97px;
  &__top {
    margin-bottom: 40px;
  }
  &__title {
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 31px;
    color: var(--light-colors-black---light);
  }
  &__body {
    display: flex;
    gap: 35px;
  }

  &__aside {
    flex: 0 0 262px;
  }
  &__main {
    flex: 1 1 auto;
  }

  .filters-bar {
    :deep(.input-wrapper) {
      padding-bottom: clamp(4px, 0.7vw, 10px);
      margin-bottom: 39px;
    }

    :deep(.input) {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 14px;

      &::placeholder {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 14px;
        color: var(--light-colors-dark-gray---light);
      }
    }

    :deep(.select) {
      .select__trigger {
        border: 1px solid var(--light-colors-gray---light);
        border-radius: 4px;
        padding-block: 17px;
        padding-inline: 11px;
      }

      .select__value {
        font-family: var(--font-family);
        font-weight: 400;
        font-size: 14px;

        color: var(--light-colors-black---light);
      }

      .select__icon {
        svg {
          width: 14px;
          height: 8px;
        }
      }
    }

    :deep(.filters-bar__select-shop-by) {
      margin-bottom: 14px;
    }

    :deep(.filters-bar__on-sale) {
      margin-bottom: 42px;
    }
  }
}
</style>
