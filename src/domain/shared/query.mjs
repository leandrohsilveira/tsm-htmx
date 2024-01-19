export function contains(value) {
  /** @type {import('@prisma/client').Prisma.QueryMode} */
  const mode = 'insensitive'
  return {
    mode,
    contains: value,
  }
}
