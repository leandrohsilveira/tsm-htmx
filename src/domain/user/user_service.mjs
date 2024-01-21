import { pageToQuery, toResultPage } from '../shared/pagination.mjs'
import { contains } from '../shared/query.mjs'
import { result } from '../shared/result.mjs'

/**
 * @function
 * @param {import('@prisma/client').PrismaClient} db
 * @returns {import('./user_service.js').UserService}
 */
export function user_service(db) {
  return {
    async list(search = '', pageable) {
      const where = {
        OR: [
          {
            email: contains(search),
          },
          {
            name: contains(search),
          },
        ],
      }
      const [count, data] = await Promise.all([
        db.user.count({ where }),
        db.user.findMany({
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            email: true,
            name: true,
            role: true,
          },
          where,
          orderBy: [
            {
              created_at: 'desc',
            },
            {
              name: 'desc',
            },
            {
              email: 'desc',
            },
          ],
          ...pageToQuery(pageable),
        }),
      ])
      return toResultPage(data, count, pageable)
    },

    async create(data) {
      return result(async () => {
        if (data.password === data.password_confirm) {
          const user = await db.user.create({
            data: {
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role,
            },
          })
          return {
            ok: true,
            data: {
              id: user.id,
              created_at: user.created_at,
              updated_at: user.updated_at,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          }
        }
        return {
          ok: false,
          error: 'password_confirmation_mismatch',
          message: 'The password confirmation does not match',
        }
      })
    },
  }
}
