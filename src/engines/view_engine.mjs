import fastifyView from '@fastify/view'
import plugin from 'fastify-plugin'
import minifier from 'html-minifier'
import { Liquid } from 'liquidjs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { accept_engine_name } from './accept_engine.mjs'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

export const view_engine_name = 'view_engine'

const view_engine = plugin(
  async (fastify) => {
    const engine = new Liquid({
      root: resolve(__dirname, '..'),
      extname: '.liquid',
    })

    engine.registerFilter('disabled', (val) => (val ? 'disabled' : ''))
    engine.registerFilter('prop', (val, property) => (val ? property : ''))
    engine.registerFilter('class', (val, name) => (val ? name : ''))
    engine.registerFilter('hasErrors', (val, field) => val && !!val[field])

    engine.registerFilter('hasError', (val, field, constraint) => {
      if (val && val[field]) {
        return Array.isArray(val[field])
          ? val[field].indexOf(constraint)
          : val[field][constraint]
      }
      return false
    })

    engine.registerFilter('errorMessage', (hasError, message) =>
      hasError ? message : '',
    )

    engine.registerFilter('plural', (count, singular, plural) =>
      count > 1 ? plural ?? `${singular}s` : singular,
    )

    await fastify.register(fastifyView, {
      engine: {
        liquid: engine,
      },
      includeViewExtension: false,
      root: resolve(__dirname, '..'),
      options: {
        useHtmlMinifier: minifier,
        htmlMinifierOptions: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeEmptyAttributes: true,
        },
      },
    })

    fastify.decorateReply(
      'view_or_json',
      function (template, data = {}, context = {}) {
        return this.request.accept({
          'text/html': () =>
            this.status(200).view(template, { ...data, ...context }),
          default: () => this.send(data),
        })
      },
    )
  },
  { name: view_engine_name, dependencies: [accept_engine_name] },
)

export default view_engine
