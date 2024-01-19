import plugin from 'fastify-plugin'
import fastifyCookie from '@fastify/cookie'

export const cookie_engine_name = 'cookie_engine'

const cookie_engine = plugin(
  /**
   *
   * @param {import('fastify').FastifyInstance} fastify
   * @param {import('./types.js').CookieOptions} options
   */
  async (fastify, { secret = 'my-cookie-secret-key' }) => {
    await fastify.register(fastifyCookie, {
      secret,
      hook: 'onRequest',
      parseOptions: {
        sameSite: 'strict',
        secure: true,
      },
    })
  },
  { name: cookie_engine_name },
)

export default cookie_engine
