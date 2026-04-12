import type { Product, ProductColor } from '@/entities/product/model/types'

/** Persisted cart line (localStorage via Pinia). */
export interface CartLineStored {
  cartItemId: string
  productId: string
  /** Selected `product_colors.id`, or `null` when the product has no colors. */
  colorId: string | null
  quantity: number
}

/** Resolved line with product payload for UI. */
export interface CartViewItem {
  cartItemId: string
  productId: string
  quantity: number
  product: Product
  selectedColor: ProductColor | null
  unitPrice: number
}

/** Row shape for full cart page cards (`CartItemCard`). */
export interface CartItem {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
}
