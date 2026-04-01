import { supabase } from '@/shared/api/supabase/client.js'
import type {
  CreateReviewPayload,
  GetProductsParams,
  GetProductsResponse,
  Product,
  Review,
  WishlistItem,
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

    if (minPrice) {
      query = query.gte('price', minPrice)
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice)
    }

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

  getProductReviews = async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ошибка при загрузке отзывов:', error.message)
      return []
    }

    return data as Review[]
  }

  getWishlistProducts = async (userId: string) => {
    if (!userId) {
      throw new Error('User ID is required to get wishlist products')
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select(
        `
      product:products (
        *,
        product_images (*),
        product_colors (*),
        product_categories (
          category_id,
          categories (*)
        )
      )
    `,
      )
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching wishlist products:', error.message)
      throw error
    }

    return data.map((item: any) => ({
      ...item.product,
      isInWishlist: true,
    }))
  }

  async addToWishlist(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeFromWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error
    return true
  }
}

export const productApi = new ProductApi()
