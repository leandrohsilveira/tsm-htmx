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
    fastify.decorateReply('htmx_view', function (templ) {
      const partialId =
        this.request.headers['hx-partial-id']?.at(0) ?? 'default'

      const templates = templ ?? this.request.routeOptions.config.templates
      const { data = {}, view_data = {} } = this.context
      if (templates) {
        const { page, partials } = templates
        return this.request.htmx({
          active: () =>
            this.status(200).view(partials[partialId] ?? partials.default, {
              ...data,
              ...view_data,
            }),
          inactive: () => this.view_or_json(page),
        })
      }
      return this.send(data)
    })
    fastify.decorate(
      'page',
      function (url_or_urls, templates, handler, options) {
        const urls = Array.isArray(url_or_urls) ? url_or_urls : [url_or_urls]
        return urls.reduce(
          (server, url) =>
            server.get(
              url,
              {
                ...(options ?? {}),
                config: {
                  ...(options?.config ?? {}),
                  templates,
                },
              },
              async (request, reply) => handler?.(request, reply) ?? reply,
            ),
          this,
        )
      },
    )

    fastify.decorate(
      'page_post',
      function (url_or_urls, templates, handler, options) {
        const urls = Array.isArray(url_or_urls) ? url_or_urls : [url_or_urls]
        return urls.reduce(
          (server, url) =>
            server.post(
              url,
              {
                ...(options ?? {}),
                config: {
                  ...(options?.config ?? {}),
                  templates,
                },
              },
              async (request, reply) => handler?.(request, reply) ?? reply,
            ),
          this,
        )
      },
    )
  },
  {
    name: htmx_engine_name,
    dependencies: [view_engine_name],
  },
)

export default htmx_engine
