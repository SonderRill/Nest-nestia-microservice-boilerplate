import {
  ArgumentsHost,
  Catch,
  HttpException,
  IntrinsicException,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { TypeGuardError } from 'typia'

import { TypedConfigService } from '../../configs'

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
  constructor(private readonly configService: TypedConfigService) {
    super()
  }

  catch(exception: any, host: ArgumentsHost) {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development'

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse() as CommonError | string

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if (
          exceptionResponse.message !== undefined &&
          typeof exceptionResponse.message !== 'string' &&
          typeof exceptionResponse.message !== 'number'
        ) {
          throw new Error('log message should be a string or number')
        }

        if (isDevelopment) {
          exceptionResponse.stack = exception.stack
        }

        exceptionResponse.statusCode = status
        exceptionResponse.message = (
          exceptionResponse.message || exception.message
        ).toString()
      }
    } else {
      exception = new IntrinsicException(exception)
    }

    super.catch(exception, host)
  }
}
