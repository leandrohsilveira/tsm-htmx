import { PrismaClient, Role } from '@prisma/client'

const client = new PrismaClient()

const email = 'admin@email.com'
const password = process.env.ADMIN_PASSWORD ?? 'pass'

async function run() {
  try {
    client.$connect()

    const user = await client.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    })
    const data = {
      id: user?.id,
      email,
      password,
      name: 'Admin',
      role: Role.ADMIN,
    }

    if (user) {
      await client.user.update({
        data,
        where: {
          id: user.id,
        },
      })
    } else {
      await client.user.create({
        data,
      })
    }
  } finally {
    client.$disconnect()
  }
}

run()
