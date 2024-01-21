import { Options } from 'ajv'
import './engines/types.d'
import { FastifyLoggerOptions } from 'fastify'
import { PinoLoggerOptions } from 'fastify/types/logger.js'

type CustomOptions = {
  ajv: {
    customOptions: Options
  }
  logger: FastifyLoggerOptions & PinoLoggerOptions
}

type RoutesOptions = { path?: string }

type MaybePromise<T> = T | Promise<T>
