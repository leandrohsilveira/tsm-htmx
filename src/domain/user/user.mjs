import { isEmpty } from 'validator'
import { schema } from '../shared/schema.mjs'
/**
 *
 * @param {import('./user.js').UserCreateData} data
 */
export function validateUserCreateData(data) {
  isEmpty(data.name, { ignore_whitespace: true })
}

export const USER_SCHEMAS = {
  UserCreateData: 'UserCreateData',
  UserEditData: 'UserEditData',
}

export const user_edit_data_schema = schema(USER_SCHEMAS.UserEditData, {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: {
      type: 'string',
      enum: ['USER', 'ADMIN'],
    },
  },
  required: ['name', 'email', 'role'],
})

export const user_create_data_schema = schema(USER_SCHEMAS.UserCreateData, {
  allOf: [{ $ref: USER_SCHEMAS.UserEditData }],
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 6,
    },
    password_confirm: {
      type: 'string',
      minLength: 6,
    },
  },
})
