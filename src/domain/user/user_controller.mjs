import { Role } from '@prisma/client'
import { toPageable } from '../shared/pagination.mjs'

/**
 * @param {import("./user_service.js").UserService} service
 */
export function user_controller(service) {
  return {
    /**
     * @function
     * @param {import("fastify").FastifyRequest<{ Querystring: Record<'page' | 'limit' | 'search', string> }>} req
     * @param {import("fastify").FastifyReply} reply
     */
    async listUsers(req, reply) {
      return reply.guard({ roles: [Role.ADMIN] }, async () => {
        const { search, page, limit } = req.query
        const result = await service.list(search, toPageable(page, limit))
        return reply.htmx_view({ result }, { search, page, limit })
      })
    },

    /**
     *
     * @param {import('fastify').FastifyRequest} req
     * @param {import('fastify').FastifyReply} reply
     */
    async addUserPage(req, reply) {
      return reply.guard({ roles: [Role.ADMIN] }, () => reply.htmx_view())
    },

    /**
     *
     * @param {import('fastify').FastifyRequest<{ Body: import('./user.js').UserCreateData }>} req
     * @param {import('fastify').FastifyReply} reply
     */
    async addUser(req, reply) {
      const { ok, error, data } = await service.create(req.body)
      if (ok) {
        return req.htmx({
          active() {
            return reply.htmx_redirect('/users')
          },
          inactive() {
            return reply.view_or_json('domain/user/success.liquid', { data })
          },
        })
      }
      const statusCode = 409
      const { name, email } = req.body
      return reply.status(statusCode).htmx_view(
        { statusCode, error },
        {
          errors: { password_confirm: [error] },
          data: { name, email },
        },
      )
    },
  }
}
