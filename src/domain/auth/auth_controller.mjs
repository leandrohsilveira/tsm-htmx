/**
 *
 * @param {import("./auth_service.js").AuthService} auth_service
 */
export function auth_controller(auth_service) {
  return {
    /**
     *
     * @param {import("fastify").FastifyRequest<{ Body: import("./auth.js").LoginCredentialsData }>} req
     * @param {import("fastify").FastifyReply} reply
     */
    async login(req, reply) {
      const { email, password } = req.body
      const result = await auth_service.login({ email, password })
      if (result.ok) {
        return reply.auth(result.data)
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
