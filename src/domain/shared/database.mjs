import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { isError } from './error.mjs'

export const DATABASE_STATUS_CODE = {
  UNIQUE_CONSTRAINT_VIOLATION: 'P2002',
}

/**
 *
 * @param {unknown} err
 * @returns {err is PrismaClientKnownRequestError}
 */
export function isDatabaseError(err) {
  return isError(err) && err.name === PrismaClientKnownRequestError.name
}

/**
 *
 * @param {unknown} err
 * @param {string} code
 * @returns {err is PrismaClientKnownRequestError}
 */
export function isDatabaseErrorCode(err, code) {
  return isDatabaseError(err) && err.code === code
}

/**
 *
 * @param {*} err
 * @returns {string[]}
 */
export function checkForUniqueConstraintViolation(err) {
  const failed_fields = []
  if (
    isDatabaseErrorCode(
      err,
      DATABASE_STATUS_CODE.UNIQUE_CONSTRAINT_VIOLATION,
    ) &&
    'target' in err.meta &&
    Array.isArray(err.meta.target)
  ) {
    failed_fields.push(...err.meta.target)
  }
  return failed_fields
}
