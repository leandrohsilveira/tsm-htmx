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
        return reply.htmx_view_or_json(
          {
            page: 'domain/user/index.liquid',
            partials: { default: 'domain/user/partials/user-list.liquid' },
          },
          { result },
          { search, page, limit },
        )
      })
    },

    /**
     *
     * @param {import('fastify').FastifyRequest} req
     * @param {import('fastify').FastifyReply} reply
     */
    async addUserPage(req, reply) {
      return reply.guard({ roles: [Role.ADMIN] }, () =>
        reply.view('domain/user/add.liquid'),
      )
    },
  }
}
