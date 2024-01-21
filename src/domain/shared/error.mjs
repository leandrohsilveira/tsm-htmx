/**
 * @param {unknown} err
 * @returns {err is Error}
 */
export function isError(err) {
  return err instanceof Error
}
