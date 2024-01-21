import { pageable_schema } from '../shared/pagination.mjs'
import { schema } from '../shared/schema.mjs'

export const USER_SCHEMAS = {
  UserCreateData: 'UserCreateData',
  UserEditData: 'UserEditData',
  ListUsersQuerystring: 'ListUsersQuerystring',
  UserDisplay: 'UserDisplay',
}

export const user_edit_data_schema = schema(USER_SCHEMAS.UserEditData, {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: {
      type: 'string',
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  required: ['email', 'role'],
})

export const user_create_data_schema = schema(USER_SCHEMAS.UserCreateData, {
  type: 'object',
  properties: {
    ...user_edit_data_schema.properties,
    password: {
      type: 'string',
      minLength: 6,
    },
    password_confirm: {
      type: 'string',
      minLength: 6,
    },
  },
  required: ['password', 'password_confirm', ...user_edit_data_schema.required],
})

export const list_users_querystirng_schema = schema(
  USER_SCHEMAS.ListUsersQuerystring,
  {
    type: 'object',
    properties: {
      ...pageable_schema.properties,
      search: {
        type: 'string',
      },
    },
  },
)
