import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

interface CommonError {
  error?: string
  errors?: [
    {
      path: string
      expected: string
      value: any
    },
  ]
  message: string
  statusCode: number
}

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse() as CommonError | string

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if (
          exceptionResponse.message !== undefined &&
          typeof exceptionResponse.message !== 'string'
        ) {
          throw new Error('message should be a string')
        }

        exceptionResponse.statusCode = status
        exceptionResponse.message ||= exception.message
      }
    }

    super.catch(exception, host)
  }
}
