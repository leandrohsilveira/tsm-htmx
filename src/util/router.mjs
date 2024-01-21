import fastifyPlugin from 'fastify-plugin'

/**
 *
 * @param {string} name
 * @param {import("./router.js").RouterFn} plugin
 * @param {string[]} [dependencies]
 * @returns
 */
export function router(name, plugin, dependencies = []) {
  return fastifyPlugin(plugin, { name, dependencies })
}
