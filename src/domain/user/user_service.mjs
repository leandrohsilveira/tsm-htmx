import { toResultPage, pageToQuery } from '../shared/pagination.mjs'
import { contains } from '../shared/query.mjs'

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
  }
}
