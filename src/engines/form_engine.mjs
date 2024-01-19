import fastifyPlugin from 'fastify-plugin'
import formbodyPlugin from '@fastify/formbody'

export const form_engine_name = 'form_engine'

const form_engine = fastifyPlugin(
  async (fastify) => {
    return await fastify.register(formbodyPlugin)
  },
  {
    name: form_engine_name,
  },
)

export default form_engine
