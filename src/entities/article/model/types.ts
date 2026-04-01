export type BlogCategory = 'Fashion' | 'Style' | 'Accessories' | 'Season'

export interface Article {
  id: string
  title: string
  slug: string
  author: string
  category: BlogCategory
  content: string
  featured_image: string | null
  created_at: string
  updated_at: string
}

export interface ArticleFilters {
  category?: BlogCategory
  search?: string
  page?: number
  limit?: number
}

export interface GetArticlesResponse {
  items: Article[]
  totalCount: number
  page: number
  limit: number
}
