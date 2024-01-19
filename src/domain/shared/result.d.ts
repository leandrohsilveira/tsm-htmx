export interface AbstractResult {
  ok: boolean
}

export interface SuccessResult<T = undefined> extends AbstractResult {
  ok: true
  data: T
}

export interface ErrorResult<T = string> extends AbstractResult {
  ok: false
  error: T | 'Error'
  message: string
}

export type Result<E = string, D = never> = {
  ok: boolean
  data?: D
  error?: E | 'Error'
  message?: string
}
