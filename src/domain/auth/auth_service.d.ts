import { LoginCredentialsData, LoginResult } from './auth.js'

export interface AuthService {
  login(creds: LoginCredentialsData): Promise<LoginResult>
}
