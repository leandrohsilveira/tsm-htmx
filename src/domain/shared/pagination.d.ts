export interface Pageable {
  page?: number
  limit?: number
}

export interface ResultPage<T> {
  items: T[]
  count: number
  page: number
  page_count: number
  limit: number
  start: number
  end: number
  first: boolean
  last: boolean
}
