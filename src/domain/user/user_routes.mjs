import fastifyPlugin from 'fastify-plugin'
import { user_controller } from './user_controller.mjs'
import { user_service } from './user_service.mjs'

const user_routes = fastifyPlugin(async (fastify) => {
  const controller = user_controller(user_service(fastify.db))

  fastify
    .get('/users', controller.listUsers)
    .get('/users/add', controller.addUserPage)
})

export default user_routes
