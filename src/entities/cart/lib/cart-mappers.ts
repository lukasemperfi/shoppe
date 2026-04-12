import type { CartItem, CartViewItem } from '../model/types'

export function mapViewItemToCartItem(v: CartViewItem): CartItem {
  const images = v.product.product_images ?? []
  const main = images.find((img) => img.is_main) ?? images[0]

  return {
    id: v.cartItemId,
    title: v.product.name,
    description: v.selectedColor ? v.selectedColor.color_name : '—',
    price: v.unitPrice,
    quantity: v.quantity,
    imageSrc: main?.url ?? '',
    imageAlt: v.product.name,
  }
}
