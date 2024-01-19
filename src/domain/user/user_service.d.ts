import { UserListResult } from './user.js'

export interface UserService {
  list(search?: string, pageable?: Pageable): Promise<UserListResult>
}
