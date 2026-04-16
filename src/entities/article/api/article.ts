import { supabase } from '@/shared/api/supabase/client'
import type { Article, ArticleComment, ArticleFilters, GetArticlesResponse } from '@/entities/article/model/types'

type CreateArticleCommentPayload = {
  user_name: string
  avatar_url?: string | null
  comment: string
}

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

  async getArticleComments(articleId: string): Promise<ArticleComment[]> {
    const { data, error } = await supabase
      .from('article_comments')
      .select('id, user_name, avatar_url, comment, created_at')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching article comments:', error.message)
      return []
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      author: row.user_name,
      avatar: row.avatar_url ?? undefined,
      content: row.comment,
      created_at: row.created_at,
    })) as ArticleComment[]
  }

  async createArticleComment(
    articleId: string,
    payload: CreateArticleCommentPayload,
  ): Promise<ArticleComment | null> {
    const { data, error } = await supabase
      .from('article_comments')
      .insert([
        {
          article_id: articleId,
          user_name: payload.user_name,
          avatar_url: payload.avatar_url ?? null,
          comment: payload.comment,
        },
      ])
      .select('id, user_name, avatar_url, comment, created_at')
      .single()

    if (error) {
      console.error('Error creating article comment:', error.message)
      throw error
    }

    if (!data) return null

    return {
      id: data.id,
      author: data.user_name,
      avatar: data.avatar_url ?? undefined,
      content: data.comment,
      created_at: data.created_at,
    } satisfies ArticleComment
  }
}

export const articleApi = new ArticleApi()
