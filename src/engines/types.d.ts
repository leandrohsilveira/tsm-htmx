import { Jwt, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import {
  FastifyInstance as Instance,
  FastifyRequest as Req,
  FastifyReply as Reply,
  FastifyReplyContext as ReplyCtx,
  RouteShorthandOptions,
  ContextConfigDefault,
} from 'fastify'
import { Negotiator } from '@fastify/accept-negotiator'
import { MaybePromise } from '../types.js'

type AcceptContentTypes = 'text/html' | 'application/json' | 'application/xml'

interface JwtInstance {
  encode(payload: string | object | Buffer, options?: SignOptions): string
  verify(token: string, options?: Omit<VerifyOptions, 'complete'>): Jwt
  decode(token: string): JwtPayload
}

interface GuardParams {
  roles: string[]
}

interface AuthClaims {
  sub: string
  roles: string[]
}

interface AuthData extends AuthClaims {
  token: string
}

interface JwtOptions {
  secret?: string
}

interface CookieOptions {
  secret?: string
}

interface AppOptions {
  jwt?: JwtOptions
  cookie?: JwtOptions
}

interface HTMXTemplates {
  page: string
  partials?: { default: string } & Partial<Record<string, string>>
  jsonStatus?: number
}

interface AcceptParams
  extends Partial<Record<AcceptContentTypes, () => FastifyReply>> {
  default: () => FastifyReply
}

declare module 'fastify' {
  interface FastifyContextConfig {
    templates?: HTMXTemplates
  }

  interface FastifyInstance extends Instance {
    db: PrismaClient
    negotiator: Negotiator
    jwt: JwtInstance

    page(
      url: string | string[],
      templates: HTMXTemplates,
      handler?: (
        request: FastifyRequest,
        reply: FastifyReply,
      ) => MaybePromise<FastifyReply>,
      options?: RouteShorthandOptions,
    ): FastifyInstance
    page_post(
      url: string | string[],
      templates: HTMXTemplates,
      handler?: (
        request: FastifyRequest,
        reply: FastifyReply,
      ) => MaybePromise<FastifyReply>,
      options?: RouteShorthandOptions,
    ): FastifyInstance
  }

  interface FastifyRequest extends Req {
    auth?: AuthData
    accept(params: AcceptParams): FastifyReply
    htmx(callbacks: {
      active: () => FastifyReply
      inactive: () => FastifyReply
    }): FastifyReply
  }

  interface FastifyReply extends Reply {
    view_or_json(template: string): FastifyReply
    auth(data: AuthClaims, redirect?: string): FastifyReply
    guard(
      params: GuardParams,
      callback: () => FastifyReply | Promise<FastifyReply>,
    ): MaybePromise<FastifyReply>
    /**
     * Checks if HX-Request header is present to add HX-Redirect header to the response, if not do a standard redirect using HTTP Status 303 (See other).
     * @param url the url to redirect
     */
    htmx_redirect(url: string): FastifyReply
    htmx_view(templates?: HTMXTemplates): FastifyReply
    data(data: object): FastifyReply
    view_data(view_data: object): FastifyReply
  }

  interface FastifyReplyContext<ContextConfig = ContextConfigDefault>
    extends ReplyCtx<ContextConfig> {
    data?: object
    view_data?: object
  }
}
