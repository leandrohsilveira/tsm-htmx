import auth_routes from './domain/auth/auth_routes.mjs'
import user_routes from './domain/user/user_routes.mjs'
import { router } from './util/router.mjs'

const app_routes = router('app_routes', async (fastify, { path = '' }) => {
  fastify
    .register(user_routes, { path: `${path}/users` })
    .register(auth_routes, { path })
})

export default app_routes
