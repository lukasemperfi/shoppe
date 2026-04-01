import { supabase } from '@/shared/api/supabase/client'
import type { CreateOrderRPCParams, Order } from '../model/types'

class OrderApi {
  createOrder = async (params: CreateOrderRPCParams): Promise<string | null> => {
    const { data, error } = await supabase.rpc('create_order_with_items', params)

    if (error) {
      console.error('Error creating order via RPC:', error.message)
      throw error
    }

    return data as string
  }

  getOrders = async (userId: string): Promise<Order[] | null> => {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error.message)
      return null
    }

    return data as Order[]
  }

  getOrderById = async (orderId: string, userId: string): Promise<Order | null> => {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Ошибка при получении заказа:', error.message)
      return null
    }

    return data as Order
  }
}

export const orderApi = new OrderApi()
