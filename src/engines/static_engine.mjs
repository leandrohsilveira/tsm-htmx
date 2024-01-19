import fastifyStatic from '@fastify/static'
import plugin from 'fastify-plugin'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

export const static_engine_name = 'static_engine'

const static_engine = plugin(
  async (fastify) => {
    await fastify.register(fastifyStatic, {
      root: resolve(__dirname, '..', '..', 'public'),
      prefix: '/public/',
      etag: true,
      lastModified: true,
      cacheControl: true,
    })
  },
  { name: static_engine_name },
)

export default static_engine
