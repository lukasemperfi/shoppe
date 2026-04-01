import { supabase } from '@/shared/api/supabase/client'
import type { UserProfile, UpdateProfile, Address, AddressDTO } from '@/entities/user/model/types'

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

  createAddress = async (addressData: AddressDTO): Promise<Address> => {
    if (addressData.is_default && addressData.user_id) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', addressData.user_id)
        .eq('address_type', addressData.address_type)
    }

    const { data, error } = await supabase.from('addresses').insert([addressData]).select().single()

    if (error) {
      console.error('Error creating address:', error.message)
      throw error
    }

    return data as Address
  }

  getUserAddresses = async (userId: string): Promise<Address[]> => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const userApi = new UserApi()
