import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { TypeGuardError } from 'typia'

import { sanitizeHeaders } from '../utils'

export interface TypiaBadRequestException extends Omit<
  TypeGuardError,
  'method'
> {
  statusCode: number
}

export interface CommonError {
  error?: string
  message?: string
  statusCode: number
  stack?: string
  code?: string
}

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor() {
    super()
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse() as CommonError | string

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if (
          exceptionResponse.message !== undefined &&
          typeof exceptionResponse.message !== 'string' &&
          typeof exceptionResponse.message !== 'number'
        ) {
          throw new Error('message should be a string')
        }

        this.logger.error({
          exception,
          headers: sanitizeHeaders(request.headers),
          url: request.url,
        })

        if (process.env.NODE_ENV === 'development') {
          exceptionResponse.stack = exception.stack
        }

        exceptionResponse.statusCode = status
        exceptionResponse.message = (
          exceptionResponse.message || exception.message
        ).toString()
      }
    }

    super.catch(exception, host)
  }
}
