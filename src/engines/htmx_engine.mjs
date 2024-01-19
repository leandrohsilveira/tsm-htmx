import fastifyPlugin from 'fastify-plugin'

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
        active: () => this.header('HX-Redirect', url).send(),
        inactive: () => this.redirect(303, url),
      })
    })
    fastify.decorateReply(
      'htmx_view_or_json',
      function ({ page, partials, jsonStatus = 200 }, data = {}, context = {}) {
        const partialId =
          this.request.headers['hx-partial-id']?.at(0) ?? 'default'
        return this.request.htmx({
          active: () =>
            this.view(partials[partialId] ?? partials.default, {
              ...data,
              ...context,
            }),
          inactive: () => this.view_or_json(page, data, context, jsonStatus),
        })
      },
    )
  },
  {
    name: htmx_engine_name,
  },
)

export default htmx_engine
