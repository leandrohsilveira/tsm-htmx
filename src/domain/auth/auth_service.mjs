import { result } from '../shared/result.mjs'

/**
 *
 * @param {import('@prisma/client').PrismaClient} db
 * @returns {import('./auth_service.js').AuthService}
 */
export default function auth_service(db) {
  return {
    /**
     *
     * @param {import('./auth.js').LoginCredentialsData} creds
     * @returns {Promise<import('./auth.js').LoginResult>}
     */
    login(creds) {
      return result(async () => {
        const { email, password } = creds
        const user = await db.user.findUnique({
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
          where: {
            email,
          },
        })
        if (!user || user.password !== password)
          return {
            ok: false,
            error: 'invalid_credentials',
            message: 'Incorrect username or password',
          }
        return {
          ok: true,
          data: {
            sub: user.id,
            roles: [user.role],
          },
        }
      })
    },
  }
}
