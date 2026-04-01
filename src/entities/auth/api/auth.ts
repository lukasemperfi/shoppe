import { supabase } from '@/shared/api/supabase/client.js'
import type { RegisterDTO, LoginDTO } from '../model/types'
import type { AuthChangeEvent, Session, AuthResponse } from '@supabase/supabase-js'

class Auth {
  onAuthChange(callback: (event: AuthChangeEvent, session: Session | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }

  async login({ email, password }: LoginDTO): Promise<AuthResponse['data']> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }

  async logout(): Promise<boolean> {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return true
  }

  async register(data: RegisterDTO): Promise<AuthResponse['data']> {
    const { email, password, first_name, last_name, display_name } = data

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password: password || '',
      options: {
        data: {
          first_name,
          last_name,
          display_name,
        },
      },
    })

    if (error) {
      console.error('Registration error:', error.message)
      throw error
    }

    return authData
  }
}

export const authApi = new Auth()
