export interface SuccessResult<T = never> {
  ok: true
  data: T
}

export interface ErrorResult<T = string> {
  ok: false
  error: T | 'Error'
  message: string
}

export type Result<E = string, D = never> = SuccessResult<D> | ErrorResult<E>
