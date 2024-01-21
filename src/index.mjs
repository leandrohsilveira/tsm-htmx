import app_engine from './engines/app_engine.mjs'
import app_routes from './routes.mjs'

/**
 * @type {import('./types.js').CustomOptions}
 */
export const options = {
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      useDefaults: 'empty',
      coerceTypes: 'array',
      allErrors: true,
      messages: false,
      strict: true,
    },
  },
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
}

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} options
 */
export default async function start(fastify, options) {
  await fastify.register(app_engine, options).register(app_routes)
}
