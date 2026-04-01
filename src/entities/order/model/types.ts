import type { Product } from '@/entities/product/model/types'

export interface OrderAddressPayload {
  first_name: string
  last_name: string
  company_name?: string
  country: string
  street_address: string
  post_code: string | number
  city: string
  phone: string
  email: string
}

export interface OrderItemPayload {
  product_id: string
  quantity: number
  price_at_purchase: number
}

export interface CreateOrderRPCParams {
  p_email: string
  p_phone: string
  p_payment_method: string
  p_delivery_option: string
  p_delivery_address: OrderAddressPayload
  p_shipping_cost: number
  p_total_sum: number
  p_items: OrderItemPayload[]
  p_user_id?: string
}

export interface OrderItemExtended extends OrderItemPayload {
  products: Product
}

export interface Order {
  id: string
  order_number: number
  email: string
  phone: string
  payment_method: string
  delivery_option: string
  delivery_address: OrderAddressPayload
  shipping_cost: number
  total_sum: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  order_items: OrderItemExtended[]
}
