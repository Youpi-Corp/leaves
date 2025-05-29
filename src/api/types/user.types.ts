export interface User {
  email: string
  id: number
  password_hash: string
  pseudo: string
  roles: string[]
  biography?: string
  profile_picture?: string
}
