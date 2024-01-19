import plugin from 'fastify-plugin'
import jwt from 'jsonwebtoken'

export const jwt_engine_name = 'jwt_engine'

const jwt_engine = plugin(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {import('./types.js').JwtOptions} options
   */
  async (fastify, { secret = 'my-token-secret' }) => {
    /** @type { import('./types.js').JwtInstance } */
    const instance = {
      encode(payload, options) {
        return jwt.sign(payload, secret, options)
      },
      decode(token) {
        return jwt.decode(token, { json: true, complete: false })
      },
      verify(token, options) {
        return jwt.verify(token, secret, { ...options, complete: true })
      },
    }

    fastify.decorate('jwt', instance)
  },
  { name: jwt_engine_name },
)

export default jwt_engine
