export interface User {
  email: string
  id: number
  password_hash?: string | null
  pseudo: string
  roles: string[]
  biography?: string
  profile_picture?: string
  community_updates?: boolean
}
