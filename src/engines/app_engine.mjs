import plugin from 'fastify-plugin'
import accept_engine from './accept_engine.mjs'
import ajv_engine from './ajv_engine.mjs'
import auth_engine from './auth_engine.mjs'
import cookie_engine from './cookie_engine.mjs'
import database_engine from './database_engine.mjs'
import form_engine from './form_engine.mjs'
import htmx_engine from './htmx_engine.mjs'
import jwt_engine from './jwt_engine.mjs'
import static_engine from './static_engine.mjs'
import view_engine from './view_engine.mjs'

export const app_engine_name = 'app_engine'

const app_engine = plugin(
  /**
   *
   * @param {import('fastify').FastifyInstance} fastify
   * @param {import('./types.js').AppOptions} options
   */
  async (fastify, { jwt, cookie }) => {
    return await fastify
      .register(database_engine)
      .register(accept_engine)
      .register(static_engine)
      .register(ajv_engine)
      .register(form_engine)
      .register(htmx_engine)
      .register(view_engine)
      .register(cookie_engine, cookie)
      .register(jwt_engine, jwt)
      .register(auth_engine)
  },
  { name: app_engine_name },
)

export default app_engine
