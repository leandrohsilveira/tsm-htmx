/**
 *
 * @param {import("./auth_service.js").AuthService} auth_service
 */
export function auth_controller(auth_service) {
  return {
    /**
     *
     * @param {import("fastify").FastifyRequest<{ Body: import("./auth.js").LoginCredentialsData, Querystring: Record<'next', string> }>} req
     * @param {import("fastify").FastifyReply} reply
     */
    async login(req, reply) {
      const { email, password } = req.body
      const { next } = req.query
      const { ok, data, error, message } = await auth_service.login({
        email,
        password,
      })
      if (ok) {
        return reply.auth(data, next)
      } else {
        const status = 403
        return reply
          .status(status)
          .data({ status, error, message })
          .view_data({ email })
          .htmx_view()
      }
    },
  }
}
