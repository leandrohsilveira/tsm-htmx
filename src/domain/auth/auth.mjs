import { schema } from '../shared/schema.mjs'

export const AUTH_SCHEMAS = {
  LoginCredentialsData: 'LoginCredentialsData',
}

export const login_credentials_data_schema = schema(
  AUTH_SCHEMAS.LoginCredentialsData,
  {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        minLength: 6,
      },
    },
    required: ['email', 'password'],
  },
)
