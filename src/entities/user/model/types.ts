export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  display_name: string | null
  email: string | null
  updated_at: string
}

export interface UpdateProfile {
  first_name: string
  last_name: string
  display_name: string
  email: string
}
