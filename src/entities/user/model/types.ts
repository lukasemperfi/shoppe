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

export type AddressType = 'billing' | 'shipping'

export interface AddressDTO {
  user_id?: string
  address_type: AddressType
  first_name: string
  last_name: string
  company_name?: string
  country: string
  street_address: string
  post_code: string
  city: string
  phone: string
  email: string
  is_default?: boolean
}

export interface Address extends AddressDTO {
  id: string
  created_at: string
}
