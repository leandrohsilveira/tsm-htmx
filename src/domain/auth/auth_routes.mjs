import fastifyPlugin from 'fastify-plugin'
import { auth_controller } from './auth_controller.mjs'
import auth_service from './auth_service.mjs'
import { AUTH_SCHEMAS, login_credentials_data_schema } from './auth.mjs'
import { schemaName } from '../shared/schema.mjs'

const auth_routes = fastifyPlugin(async (fastify) => {
  fastify.addSchema(login_credentials_data_schema)

  const controller = auth_controller(auth_service(fastify.db))

  fastify.get('/login', controller.loginPage)
  fastify.post(
    '/login',
    {
      schema: {
        body: { $ref: schemaName(AUTH_SCHEMAS.LoginCredentialsData) },
      },
    },
    controller.login,
  )
})

export default auth_routes
