import { defineStore } from 'pinia'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { supabase } from '@/shared/api/supabase/client'
import { authApi } from '@/entities/auth/api/auth'
import type { LoginDTO, RegisterDTO } from './types'

type AuthState = {
  isReady: boolean
  session: Session | null
  user: User | null
  _unsubscribe: null | (() => void)
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isReady: false,
    session: null,
    user: null,
    _unsubscribe: null,
  }),

  getters: {
    isAuthed: (s) => !!s.session?.user,
  },

  actions: {
    _applySession(session: Session | null) {
      this.session = session
      this.user = session?.user ?? null
    },

    async init() {
      if (this._unsubscribe) return

      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      this._applySession(data.session)
      this.isReady = true

      this._unsubscribe = authApi.onAuthChange((event, session) => {
        this._onAuthEvent(event, session)
      })
    },

    _onAuthEvent(_event: AuthChangeEvent, session: Session | null) {
      this._applySession(session)
      this.isReady = true
    },

    async login(dto: LoginDTO) {
      const data = await authApi.login(dto)
      this._applySession(data.session)
      this.isReady = true
      return data
    },

    async register(dto: RegisterDTO) {
      const data = await authApi.register(dto)
      this._applySession(data.session)
      this.isReady = true
      return data
    },

    async logout() {
      await authApi.logout()
      this._applySession(null)
      this.isReady = true
    },

    dispose() {
      this._unsubscribe?.()
      this._unsubscribe = null
    },
  },
})

