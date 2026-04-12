import type { Product } from '@/entities/product/model/types'

export function getProductUnitPrice(product: Product): number {
  const r = product.discount
  if (r != null && r > 0) {
    const effective = Math.min(1, Math.max(0, r))
    return Math.round(product.price * (1 - effective) * 100) / 100
  }
  return product.price
}
