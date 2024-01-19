import 'dotenv/config'
import app_engine from './engines/app_engine.mjs'
import routes from './routes.mjs'

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function start(fastify, options) {
  await fastify.register(app_engine, options).register(routes)
}
