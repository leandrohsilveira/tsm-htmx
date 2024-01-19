import { PrismaClient } from '@prisma/client'
import plugin from 'fastify-plugin'

export const database_engine_name = 'database_engine'

const database_engine = plugin(
  async (server) => {
    const db = new PrismaClient()

    await db.$connect()

    // Make Prisma Client available through the fastify server instance: server.db
    server.decorate('db', db)

    server.addHook('onClose', async (server) => {
      await server.db.$disconnect()
    })
  },
  { name: database_engine_name },
)

export default database_engine
