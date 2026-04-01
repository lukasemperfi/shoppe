export interface UserMetadata {
  first_name: string
  last_name: string
  display_name: string
}

export interface RegisterDTO extends UserMetadata {
  email: string
  password?: string
}

export interface LoginDTO {
  email: string
  password: string
}
