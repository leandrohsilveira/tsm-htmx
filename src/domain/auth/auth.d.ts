import { Role } from '@prisma/client'
import { Result } from '../shared/result.js'

export interface AuthClaimsData {
  sub: string
  roles: Role[]
}

export interface AuthData {
  token: string
  claims: AuthClaimsData
}

export interface LoginCredentialsData {
  email: string
  password: string
}

export type LoginErrors = 'invalid_credentials'
export type LoginResult = Result<LoginErrors, AuthClaimsData>
