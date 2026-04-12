import { productApi } from '@/entities/product/api/product'
import type { Product, ProductColor } from '@/entities/product/model/types'
import type { CartLineStored, CartViewItem } from '../model/types'
import { getProductUnitPrice } from './product-price'

export async function buildCartViewItems(lines: CartLineStored[]): Promise<CartViewItem[]> {
  if (!lines.length) return []

  const productIds = [...new Set(lines.map((l) => l.productId))]
  const products = await productApi.getProductsByIds(productIds)
  const productMap = new Map(products.map((p) => [p.id, p]))

  return lines.flatMap((line) => {
    const product = productMap.get(line.productId)
    if (!product) return []

    let selectedColor: ProductColor | null = null
    if (line.colorId) {
      selectedColor = product.product_colors?.find((c) => c.id === line.colorId) ?? null
      if (!selectedColor) return []
    }

    return [
      {
        cartItemId: line.cartItemId,
        productId: line.productId,
        quantity: line.quantity,
        product,
        selectedColor,
        unitPrice: getProductUnitPrice(product),
      },
    ]
  })
}
