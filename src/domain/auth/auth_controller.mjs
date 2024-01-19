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
      }
      if (error === 'invalid_credentials') {
        return reply.htmx_view_or_json(
          {
            page: 'domain/auth/login.liquid',
            partials: { default: 'domain/auth/partials/login_form.liquid' },
            jsonStatus: 403,
          },
          { status: 403, error, message },
          { email },
        )
      }
    },

    /**
     *
     * @param {import("fastify").FastifyRequest} req
     * @param {import("fastify").FastifyReply} reply
     * @returns
     */
    async loginPage(req, reply) {
      return reply.view('domain/auth/login.liquid')
    },
  }
}
