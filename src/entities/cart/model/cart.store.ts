import { defineStore } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { productApi } from '@/entities/product/api/product'
import type { Product } from '@/entities/product/model/types'
import { buildCartViewItems } from '../lib/build-cart-view-items'
import { getProductUnitPrice } from '../lib/product-price'
import type { CartLineStored, CartViewItem } from './types'

export interface AddCartItemPayload {
  productId: string
  colorId: string | null
  quantity?: number
  product?: Product
}

function makeCartItemId(productId: string, colorId: string | null): string {
  return colorId ? `${productId}_${colorId}` : `${productId}_default`
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartLineStored[]>([])
    const viewItems = ref<CartViewItem[]>([])
    const isViewItemsLoading = ref(false)
    const viewItemsError = ref<string | null>(null)

    const cartCount = computed(() => items.value.reduce((sum, line) => sum + line.quantity, 0))

    const totalSum = computed(() =>
      viewItems.value.reduce((sum, v) => sum + v.unitPrice * v.quantity, 0),
    )

    function syncViewQuantitiesFromItems() {
      const qtyById = new Map(items.value.map((i) => [i.cartItemId, i.quantity]))
      viewItems.value = viewItems.value
        .filter((v) => qtyById.has(v.cartItemId))
        .map((v) => ({ ...v, quantity: qtyById.get(v.cartItemId)! }))
    }

    function mergeProductIntoViewItems(product: Product, cartItemId: string, quantity: number) {
      const line = items.value.find((i) => i.cartItemId === cartItemId)
      if (!line) return

      let selectedColor = null as CartViewItem['selectedColor']
      if (line.colorId) {
        selectedColor = product.product_colors?.find((c) => c.id === line.colorId) ?? null
        if (!selectedColor) {
          refreshViewItems()
          return
        }
      }

      const entry: CartViewItem = {
        cartItemId: line.cartItemId,
        productId: line.productId,
        quantity,
        product,
        selectedColor,
        unitPrice: getProductUnitPrice(product),
      }

      const existingIx = viewItems.value.findIndex((v) => v.cartItemId === cartItemId)
      if (existingIx >= 0) {
        viewItems.value = viewItems.value.map((v, i) => (i === existingIx ? entry : v))
      } else {
        viewItems.value = [...viewItems.value, entry]
      }
    }

    async function refreshViewItems() {
      if (items.value.length === 0) {
        viewItems.value = []
        viewItemsError.value = null
        isViewItemsLoading.value = false
        return
      }

      isViewItemsLoading.value = true
      viewItemsError.value = null
      try {
        viewItems.value = await buildCartViewItems(items.value)
      } catch (e) {
        viewItemsError.value = e instanceof Error ? e.message : 'Failed to load cart'
        viewItems.value = []
      } finally {
        isViewItemsLoading.value = false
      }
    }

    function addItem(payload: AddCartItemPayload) {
      const qty = payload.quantity ?? 1
      const cartItemId = makeCartItemId(payload.productId, payload.colorId)
      const existing = items.value.find((i) => i.cartItemId === cartItemId)

      const productName = payload.product?.name ?? 'Item'

      if (existing) {
        items.value = items.value.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + qty } : i,
        )
        syncViewQuantitiesFromItems()
        toast.success('Added to cart', {
          description:
            qty > 1
              ? `${qty} more of "${productName}" in your cart.`
              : `"${productName}" quantity updated in your cart.`,
        })
        return
      }

      items.value = [
        ...items.value,
        {
          cartItemId,
          productId: payload.productId,
          colorId: payload.colorId,
          quantity: qty,
        },
      ]

      if (payload.product) {
        mergeProductIntoViewItems(payload.product, cartItemId, qty)
      } else {
        refreshViewItems()
      }

      toast.success('Added to cart', {
        description:
          qty > 1
            ? `${qty} × "${productName}" added to your cart.`
            : `"${productName}" added to your cart.`,
      })
    }

    async function addProductFromListing(productId: string, quantity = 1) {
      const p = await productApi.getProductById(productId)
      if (!p || p.is_sold_out) return

      const colors = p.product_colors ?? []
      const firstColor = colors[0]
      const colorId = firstColor ? firstColor.id : null

      addItem({ productId: p.id, colorId, quantity, product: p })
    }

    function removeItem(cartItemId: string) {
      const viewItem = viewItems.value.find((v) => v.cartItemId === cartItemId)
      const productName = viewItem?.product.name ?? 'Item'

      items.value = items.value.filter((i) => i.cartItemId !== cartItemId)
      syncViewQuantitiesFromItems()

      toast.warning('Removed from cart', {
        description: `"${productName}" was removed from your cart.`,
      })
    }

    function incrementQuantity(cartItemId: string) {
      items.value = items.value.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
      )
      syncViewQuantitiesFromItems()
    }

    function decrementQuantity(cartItemId: string) {
      const existing = items.value.find((i) => i.cartItemId === cartItemId)
      if (!existing) return

      if (existing.quantity <= 1) {
        removeItem(cartItemId)
        return
      }

      items.value = items.value.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i,
      )
      syncViewQuantitiesFromItems()
    }

    function setQuantity(cartItemId: string, quantity: number) {
      if (quantity <= 0) {
        removeItem(cartItemId)
        return
      }

      items.value = items.value.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
      syncViewQuantitiesFromItems()
    }

    function clearCart() {
      items.value = []
      viewItems.value = []
      viewItemsError.value = null
      isViewItemsLoading.value = false
    }

    return {
      items,
      viewItems,
      isViewItemsLoading,
      viewItemsError,
      cartCount,
      totalSum,
      addItem,
      addProductFromListing,
      removeItem,
      incrementQuantity,
      decrementQuantity,
      setQuantity,
      clearCart,
      refreshViewItems,
    }
  },
  {
    persist: {
      key: 'shoppe-cart',
      pick: ['items'],
      afterHydrate: (ctx: PiniaPluginContext) => {
        const store = ctx.store as {
          items?: CartLineStored[]
          refreshViewItems?: () => Promise<void>
        }
        if (store.items?.length && store.refreshViewItems) {
          store.refreshViewItems()
        }
      },
    },
  },
)
