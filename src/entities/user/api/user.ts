import { supabase } from '@/shared/api/supabase/client'
import type { UserProfile, UpdateProfile } from '@/entities/user/model/types'

class UserApi {
  getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data as UserProfile
  }

  updateProfile = async (userId: string, data: UpdateProfile): Promise<{ success: boolean }> => {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: data.display_name,
        email: data.email,
      })
      .eq('id', userId)

    if (profileError) {
      throw profileError
    }

    return { success: true }
  }
}

export const userApi = new UserApi()
