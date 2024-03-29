import fastifyPlugin from 'fastify-plugin'
import {
  checkForUniqueConstraintViolation,
  isDatabaseError,
} from '../domain/shared/database.mjs'
import { htmx_engine_name } from './htmx_engine.mjs'

export const error_handler_engine_name = 'error_handler_engine'

/**
 *
 * @param {import('fastify/types/schema.js').FastifySchemaValidationError} validation
 * @returns {string}
 */
function get_field(validation) {
  const { instancePath, keyword, params } = validation
  if (keyword === 'required') {
    return /** @type {string} */ (params.missingProperty)
  }
  return instancePath.replace(/^\//, '')
}

const error_handler_engine = fastifyPlugin(
  async (fastify) => {
    // fastify.setNotFoundHandler(async (req, reply) => {
    // TODO: add not found error handler
    // })

    fastify.setErrorHandler(async (error, req, reply) => {
      if (isDatabaseError(error)) {
        const unique_errors = checkForUniqueConstraintViolation(error)
        if (unique_errors.length) {
          const errors = unique_errors.reduce(
            (acc, field) => ({
              ...acc,
              [field]: { unique: {} },
            }),
            {},
          )
          return reply
            .status(409)
            .data({
              statusCode: 409,
              error: 'unique_constraint_violation',
              errors,
            })
            .view_data({ data: req.body })
            .htmx_view()
        }
        return reply
          .status(500)
          .data({ statusCode: 500, error: 'internal_server_error' })
          .htmx_view()
      } else {
        const { validation, validationContext, statusCode = 500 } = error
        if (validation) {
          let errors = validation.reduce((acc, item) => {
            const { keyword, params } = item
            const field = get_field(item)
            return {
              ...acc,
              [field]: {
                ...(acc[field] ?? {}),
                [keyword]: params,
              },
            }
          }, {})
          return reply
            .status(statusCode)
            .data({
              statusCode,
              error: 'validation_error',
              errors,
            })
            .view_data({ data: req[validationContext] })
            .htmx_view()
        }
        return reply
          .status(statusCode)
          .data({ statusCode, error: 'internal_server_error' })
          .htmx_view()
      }
    })
  },
  { name: error_handler_engine_name, dependencies: [htmx_engine_name] },
)

export default error_handler_engine
