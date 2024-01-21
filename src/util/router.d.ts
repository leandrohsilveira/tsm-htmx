import { FastifyPluginAsync } from 'fastify'
import { RoutesOptions } from '../types.js'

export type RouterFn = FastifyPluginAsync<RoutesOptions>
