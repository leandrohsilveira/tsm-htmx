import { FastifyReply } from 'fastify'
import { MaybePromise } from '../../types.js'

export type Result<E = string, D = never> = {
  ok: boolean
  data?: D
  error?: E
  message?: string
}

export type ResultHandler<T> = (result: T) => MaybePromise<FastifyReply>

export type ResultHandlersMap<E = string, D = never> = {
  ok: ResultHandler<Result<E, D>>
} & Partial<Record<E, ResultHandler<Result<E, D>>>>
