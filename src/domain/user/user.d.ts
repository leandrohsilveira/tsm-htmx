// import { ResultPage } from '$util'
import { Role, User } from '@prisma/client'
import { Result } from '../shared/result.js'

export type UserDisplay = Omit<User, 'password'>

export type UserListResult = ResultPage<UserDisplay>

export interface UserEditData {
  name: string
  email: string
  role: Role
}

export interface UserCreateData extends UserEditData {
  password: string
  password_confirm: string
}

export type UserCreateErrors = 'password_confirmation_mismatch'
export type UserCreateResult = Result<UserCreateErrors, UserDisplay>
