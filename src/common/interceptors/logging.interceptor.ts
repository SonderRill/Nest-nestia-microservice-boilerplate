import { randomUUID } from 'node:crypto'

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { TypedConfigService } from '../../configs'
import { sanitizeRequestData } from '../utils'

const LOG_EXCLUDED_PATHS = ['/metrics'] as readonly string[]

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  constructor(private readonly configService: TypedConfigService) {}

  private isExcludedFromLogging(path: string): boolean {
    return LOG_EXCLUDED_PATHS.includes(path)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()
    const isDevelopment = this.configService.get('NODE_ENV') === 'development'

    const path = request.url.split('?')[0]
    const isSkipLogging = this.isExcludedFromLogging(path)

    const reqId = (request.id as string) || randomUUID()

    const startTime = process.hrtime.bigint()

    if (!isSkipLogging) {
      this.logger.log(
        {
          reqId,
          req: {
            method: request.method,
            url: request.url,
            host: request.headers.host || request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket?.remotePort,
          },
        },
        'incoming request',
      )
    }

    return next.handle().pipe(
      tap({
        next: () => {
          if (isSkipLogging) return

          const endTime = process.hrtime.bigint()
          const responseTimeMs = Number(endTime - startTime) / 1_000_000

          this.logger.log(
            {
              reqId,
              res: {
                statusCode: response.statusCode,
              },
              responseTime: responseTimeMs,
            },
            'request completed',
          )
        },
        error: (error) => {
          if (isSkipLogging) return

          const endTime = process.hrtime.bigint()
          const responseTimeMs = Number(endTime - startTime) / 1_000_000

          /**
           * The interceptor does not have access to the final status code
           */
          let statusCode = 500
          if (error instanceof HttpException) {
            statusCode = error.getStatus()
          }

          const errorCompleteLog = {
            reqId,
            url: request.url,
            method: request.method,
            res: {
              statusCode,
            },
            headers: sanitizeRequestData(request.headers),
            err: error,
            responseTime: responseTimeMs,
          }

          // can be customized to your liking
          if (isDevelopment) {
            errorCompleteLog['body'] = request.body
            errorCompleteLog['query'] = request.query
            errorCompleteLog['params'] = request.params
            errorCompleteLog['headers'] = request.headers
          }

          this.logger.error('request completed with error', errorCompleteLog)
        },
      }),
    )
  }
}
