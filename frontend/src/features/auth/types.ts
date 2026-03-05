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
}

export type AuthState = {
  user: AuthResponse | null
  accessToken: string | null
  loading: boolean
  error: string | null
  isAuth: boolean;
}