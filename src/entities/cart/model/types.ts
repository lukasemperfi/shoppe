import type { Product, ProductColor } from '@/entities/product/model/types'

export interface CartLineStored {
  cartItemId: string
  productId: string
  colorId: string | null
  quantity: number
}

export interface CartViewItem {
  cartItemId: string
  productId: string
  quantity: number
  product: Product
  selectedColor: ProductColor | null
  unitPrice: number
}

export interface CartItem {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
}
