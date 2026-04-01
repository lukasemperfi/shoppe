import { supabase } from '@/shared/api/supabase/client'
import type { Article, ArticleFilters, GetArticlesResponse } from '@/entities/article/model/types'

class ArticleApi {
  async getArticles(filters: ArticleFilters = {}): Promise<GetArticlesResponse | null> {
    const { category, search, page = 1, limit = 10 } = filters

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('articles').select('*', { count: 'exact' })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching articles:', error.message)
      throw error
    }

    return {
      items: data as Article[],
      totalCount: count || 0,
      page,
      limit,
    }
  }
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single()

    if (error) {
      console.error('Ошибка при получении статьи:', error.message)
      return null
    }

    return data as Article
  }
}

export const articleApi = new ArticleApi()
