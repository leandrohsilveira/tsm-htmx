/**
 * @template E
 * @template D
 * @template {import("./result.js").Result<E, D>} R
 * @param {() => Promise<R>} callback
 * @return {Promise<R>}
 */
export async function result(callback) {
  try {
    return await callback()
  } catch (error) {
    // @ts-expect-error some wierd typing issue
    return {
      ok: false,
      error: 'Error',
      message: String(error.message),
    }
  }
}
