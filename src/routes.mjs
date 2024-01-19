import auth_routes from './domain/auth/auth_routes.mjs'
import user_routes from './domain/user/user_routes.mjs'

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify) {
  fastify.get('/', async (req, reply) => {
    return reply.view_or_json(
      'index.liquid',
      { name: 'John Doe' },
      { message: 'I exist only in view' },
    )
  })

  fastify.register(user_routes).register(auth_routes)
}
