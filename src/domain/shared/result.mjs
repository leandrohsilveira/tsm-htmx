/**
 * @template E
 * @template D
 * @template {import("./result.js").Result<E, D>} R
 * @param {() => Promise<R>} callback
 * @return {Promise<R>}
 */
export async function result(callback) {
  return await callback()
}

/**
 * @template {string} E
 * @template R
 * @param {import("./result.js").Result<E, R>} result
 * @returns {Promise<import("./result.js").Result<E, R>>}
 */
export function handleResult(result) {
  if (result.ok) {
    return Promise.resolve(result)
  }
  return Promise.reject(result)
}
