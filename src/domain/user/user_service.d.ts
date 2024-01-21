import { UserCreateData, UserCreateResult, UserListResult } from './user.js'

export interface UserService {
  list(search?: string, pageable?: Pageable): Promise<UserListResult>
  create(data: UserCreateData): Promise<UserCreateResult>
}
