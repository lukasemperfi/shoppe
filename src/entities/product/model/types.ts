export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface ProductImage {
  id: string
  url: string
  is_main: boolean
  product_id: string
  order_index: number
}

export interface ProductColor {
  id: string
  color_hex: string
  color_name: string
  product_id: string
}

export interface ProductCategoryLink {
  category_id: string
  categories: Category
}

export interface Review {
  id: string
  product_id: string
  // user_id: string;
  rating: number
  comment: string
  created_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  discount: number | null
  weight: number
  dimensions: string
  material: string
  is_new: boolean
  is_sold_out: boolean
  average_rating: number
  review_count: number
  created_at: string
  updated_at: string
  product_images: ProductImage[]
  product_colors: ProductColor[]
  product_categories: ProductCategoryLink[]
  reviews?: Review[]
}

export interface GetProductsParams {
  searchName?: string
  minPrice?: number
  maxPrice?: number
  categoryId?: string
  hasDiscount?: boolean
  isSoldOut?: boolean
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface GetProductsResponse {
  items: Product[]
  totalCount: number
  page: number
  limit: number
}

export interface CreateReviewPayload {
  product_id: string
  user_name: string
  rating: number
  comment: string
  email: string
}
