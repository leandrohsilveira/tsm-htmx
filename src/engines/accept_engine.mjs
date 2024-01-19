import plugin from 'fastify-plugin'
import { negotiate } from '@fastify/accept-negotiator'

export const accept_engine_name = 'accept_engine'

const accept_engine = plugin(
  async (fastify) => {
    fastify
      .decorate('negotiate', negotiate)
      .decorateRequest('accept', function (params) {
        const content_type = negotiate(this.headers.accept, [
          'text/html',
          'application/json',
          'application/xml',
        ])
        const reply = params[content_type] ?? params.default
        return reply()
      })
  },
  { name: accept_engine_name },
)

export default accept_engine
