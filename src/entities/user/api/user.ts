import { supabase } from '@/shared/api/supabase/client'
import type { UserProfile } from '../model/types'

class UserApi {
  getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data as UserProfile
  }
}

export const userApi = new UserApi()
