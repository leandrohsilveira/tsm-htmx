/**
 * @param {string} $id the schema ID
 * @param {Omit<import("json-schema").JSONSchema7, '$id'>} def
 * @returns {import("json-schema").JSONSchema7}
 */
export function schema($id, def) {
  return {
    $id,
    ...def,
  }
}

/**
 *
 * @param {string} $id
 * @returns {string}
 */
export function schemaName($id) {
  return `${$id}#`
}
