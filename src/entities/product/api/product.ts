import { supabase } from '@/shared/api/supabase/client.js'
import type {
  CreateReviewPayload,
  GetProductsParams,
  GetProductsResponse,
  Product,
} from '../model/types'
import { PRODUCT_BASE_SELECT, PRODUCT_DETAILS_SELECT } from './config'

class ProductApi {
  getProducts = async (params: GetProductsParams = {}): Promise<GetProductsResponse | null> => {
    const {
      searchName,
      minPrice,
      maxPrice,
      categoryId,
      hasDiscount,
      isSoldOut,
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = params

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('products').select(PRODUCT_BASE_SELECT, { count: 'exact' })

    if (searchName) {
      query = query.ilike('name', `%${searchName}%`)
    }

    if (minPrice) query = query.gte('price', minPrice)
    if (maxPrice) query = query.lte('price', maxPrice)

    if (categoryId) {
      query = query.eq('product_categories.category_id', categoryId)
    }

    if (hasDiscount === false) {
      query = query.is('discount', null)
    } else if (hasDiscount === true) {
      query = query.not('discount', 'is', null)
    }

    if (typeof isSoldOut === 'boolean') {
      query = query.eq('is_sold_out', isSoldOut)
    }

    query = query.order('price', { ascending: sortOrder === 'asc' })
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return null
    }

    return {
      items: data as Product[],
      totalCount: count || 0,
      page,
      limit,
    }
  }

  getProductById = async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_DETAILS_SELECT)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product by id:', error)
      return null
    }

    return data as Product
  }

  addReview = async (payload: CreateReviewPayload) => {
    const { data, error } = await supabase.from('reviews').insert([payload]).select().single()

    if (error) {
      console.error('Error adding review:', error)
      throw error
    }

    return data
  }
}

export const productApi = new ProductApi()
