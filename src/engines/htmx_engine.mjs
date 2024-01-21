import fastifyPlugin from 'fastify-plugin'
import { view_engine_name } from './view_engine.mjs'

export const htmx_engine_name = 'htmx_engine'

const htmx_engine = fastifyPlugin(
  async (fastify) => {
    fastify.decorateRequest('htmx', function ({ active, inactive }) {
      if (this.headers['hx-request']) {
        return active()
      } else {
        return inactive()
      }
    })
    fastify.decorateReply('htmx_redirect', function (url) {
      return this.request.htmx({
        active: () => this.header('HX-Redirect', url).status(200).send(),
        inactive: () => this.redirect(303, url),
      })
    })
    fastify.decorateReply('htmx_view', function (data = {}, context = {}) {
      const partialId =
        this.request.headers['hx-partial-id']?.at(0) ?? 'default'

      const templates = this.request.routeOptions.config.templates
      if (templates) {
        const { page, partials } = templates
        return this.request.htmx({
          active: () =>
            this.status(200).view(partials[partialId] ?? partials.default, {
              ...data,
              ...context,
            }),
          inactive: () => this.view_or_json(page, data, context),
        })
      }
      return this.send(data)
    })
  },
  {
    name: htmx_engine_name,
    dependencies: [view_engine_name],
  },
)

export default htmx_engine
