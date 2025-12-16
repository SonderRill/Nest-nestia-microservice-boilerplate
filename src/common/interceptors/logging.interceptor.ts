import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const log = request.log as any

    const isDevelopment = process.env.NODE_ENV === 'development'
    const shouldLogDetails = isDevelopment

    return next.handle().pipe(
      tap({
        error: () => {
          // Extending automatic response logging during error in dev mode
          if (shouldLogDetails) {
            log.setBindings({
              body: request.body,
              query: request.query,
              params: request.params,
              headers: request.headers,
              url: request.url,
              method: request.method,
            })
          }
        },
      }),
    )
  }
}
