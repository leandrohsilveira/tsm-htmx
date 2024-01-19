/** @type {import('./pagination.js').Pageable} */
export const DEFAULT_PAGEABLE = {
  page: 1,
  limit: 5,
}

/**
 * @param {import('./pagination.js').Pageable} [pageable]
 * @returns {import('./pagination.js').Pageable}
 */
function defaultPageable(pageable = DEFAULT_PAGEABLE) {
  return {
    page: pageable.page ?? DEFAULT_PAGEABLE.page,
    limit: pageable.limit ?? DEFAULT_PAGEABLE.limit,
  }
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} count
 * @param {import('./pagination.js').Pageable} pageable
 * @returns {import('./pagination.js').ResultPage<T>}
 */
export function toResultPage(items, count, pageable) {
  const { limit, page } = defaultPageable(pageable)
  const isExact = count % limit == 0
  const page_count = Math.floor(count / limit) + (isExact ? 0 : 1)
  const { skip } = pageToQuery({ page, limit })
  return {
    items,
    count,
    page_count,
    page,
    limit,
    start: skip + 1,
    end: skip + limit > count ? count : skip + limit,
    first: page === 1,
    last: page === page_count,
  }
}

export function toPageable(page = '', limit = '') {
  return defaultPageable({
    page: page !== '' ? Number(page) : undefined,
    limit: limit !== '' ? Number(limit) : undefined,
  })
}

/**
 *
 * @param {import('./pagination.js').Pageable} [pageable]
 * @returns {{ skip: number, take: number }}
 */
export function pageToQuery(pageable) {
  const { page, limit } = defaultPageable(pageable)
  return {
    skip: page * limit - limit,
    take: limit,
  }
}
