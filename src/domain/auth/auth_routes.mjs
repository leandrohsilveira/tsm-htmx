import { router } from '../../util/router.mjs'
import { schemaName } from '../shared/schema.mjs'
import { AUTH_SCHEMAS, login_credentials_data_schema } from './auth.mjs'
import { auth_controller } from './auth_controller.mjs'
import auth_service from './auth_service.mjs'

const auth_routes = router('auth_routes', async (fastify, { path = '' }) => {
  fastify.addSchema(login_credentials_data_schema)

  const controller = auth_controller(auth_service(fastify.db))

  const login_templates = {
    page: 'domain/auth/login.liquid',
    partials: { default: 'domain/auth/partials/login_form.liquid' },
  }

  fastify.page(`${path}/login`, login_templates)
  fastify.page_post(`${path}/login`, login_templates, controller.login, {
    schema: {
      body: { $ref: schemaName(AUTH_SCHEMAS.LoginCredentialsData) },
    },
  })
})

export default auth_routes
