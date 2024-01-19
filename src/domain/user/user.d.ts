// import { ResultPage } from '$util'
import { Role, User } from '@prisma/client'

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
