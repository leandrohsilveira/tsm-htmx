import { router } from '../../util/router.mjs'
import { schemaName } from '../shared/schema.mjs'
import {
  USER_SCHEMAS,
  list_users_querystirng_schema,
  user_create_data_schema,
  user_edit_data_schema,
} from './user.mjs'
import { user_controller } from './user_controller.mjs'
import { user_service } from './user_service.mjs'

const user_routes = router(
  'user_routes',
  async (fastify, { path = '/users' }) => {
    fastify.addSchema(list_users_querystirng_schema)
    fastify.addSchema(user_edit_data_schema)
    fastify.addSchema(user_create_data_schema)

    const controller = user_controller(user_service(fastify.db))

    const list_users_schemas = {
      querystring: { $ref: schemaName(USER_SCHEMAS.ListUsersQuerystring) },
    }

    const list_users_templates = {
      page: 'domain/user/index.liquid',
      partials: { default: 'domain/user/partials/user-list.liquid' },
    }

    const add_user_schemas = {
      body: { $ref: schemaName(USER_SCHEMAS.UserCreateData) },
    }

    const add_user_templates = {
      page: 'domain/user/add.liquid',
      partials: { default: 'domain/user/partials/user-form.liquid' },
    }

    fastify
      .page(path, list_users_templates, controller.listUsers, {
        schema: list_users_schemas,
      })

      .page(`${path}/add`, add_user_templates, controller.addUserPage)

      .page_post(
        [path, `${path}/add`],
        add_user_templates,
        controller.addUser,
        {
          schema: add_user_schemas,
        },
      )
  },
)

export default user_routes
