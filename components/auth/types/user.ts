export interface User {
  email: string
  name: string
  phone: string
  token: string
}

export interface SignInType {
  email: string
  password: string
}

export interface SignUpType extends SignInType {
  phone: string
  name: string
}
