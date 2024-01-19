import plugin from 'fastify-plugin'
import { accept_engine_name } from './accept_engine.mjs'
import { cookie_engine_name } from './cookie_engine.mjs'
import { jwt_engine_name } from './jwt_engine.mjs'
import { htmx_engine_name } from './htmx_engine.mjs'

export const auth_engine_name = 'auth_engine'

const auth_engine = plugin(
  async (fastify) => {
    fastify.decorateRequest('auth', null)

    fastify.decorateReply('guard', function ({ roles }, callback) {
      if (this.request.auth) {
        if (
          this.request.auth.roles.some((role) =>
            roles.some((reqRole) => String(role) === String(reqRole)),
          )
        ) {
          return callback()
        }
        return this.request.accept({
          'text/html': () => this.htmx_redirect('/forbidden'),
          default: () =>
            this.status(403).send({
              status: 403,
              message: 'Forbidden',
              detail: 'Insufficient roles or permissions',
            }),
        })
      }
      return this.request.accept({
        'text/html': () => this.htmx_redirect('/login'),
        default: () =>
          this.status(401).send({
            status: 401,
            message: 'Unauthorized',
            detail: 'Not authenticated',
          }),
      })
    })

    fastify.decorateReply('auth', function (data, redirect = '/') {
      const token = fastify.jwt.encode({ sub: data }, { expiresIn: '1 day' })
      const setCookie = () => {
        return this.setCookie('authorization', token)
      }

      return this.request.htmx({
        active: () => setCookie().htmx_redirect(redirect),
        inactive: () =>
          this.request.accept({
            'text/html': () => setCookie().htmx_redirect(redirect),
            default: () => this.send({ ...data, token }),
          }),
      })
    })

    fastify.addHook('preHandler', (req, reply, done) => {
      let token = undefined
      if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '')
      } else if ('authorization' in req.cookies) {
        token = req.cookies.authorization
      }
      if (token && fastify.jwt.verify(token)) {
        /** @type {*} */
        const decoded = fastify.jwt.decode(token)
        const { sub, roles } = decoded.sub
        req.auth = {
          sub,
          roles,
          token,
        }
      }
      done()
    })
  },
  {
    name: auth_engine_name,
    dependencies: [
      jwt_engine_name,
      cookie_engine_name,
      accept_engine_name,
      htmx_engine_name,
    ],
  },
)

export default auth_engine
