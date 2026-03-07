export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  user:User
}

export type AuthState = {
  user: User | null
  accessToken: string | null
  loading: boolean
  error: string | null
  isAuth: boolean;
}

export type User={
  id: number
  email: string
  firstName: string
  lastName: string; 
}