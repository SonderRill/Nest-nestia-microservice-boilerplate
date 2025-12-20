import { ConsoleLogger, Injectable } from '@nestjs/common'
import { FastifyBaseLogger } from 'fastify'

@Injectable()
export class PinoLogger extends ConsoleLogger {
  private readonly pino: FastifyBaseLogger

  constructor(baseLogger: FastifyBaseLogger) {
    super()
    this.pino = baseLogger
  }

  error(message: any): void
  error(message: any, context: string): void
  error(message: any, obj: any): void
  error(message: any, obj: any, context: string): void
  error(message: any, ...args: any[]) {
    const { msg, context, err, data } = this.prepareLogData(message, ...args)

    const contextMsg = msg
      ? `[${context}] ${msg}`
      : err?.message
        ? `[${context}] ${err.message}`
        : `[${context}]`

    this.pino.error({ msg: contextMsg, err, data })
  }

  log(message: any): void
  log(message: any, context: string): void
  log(message: any, obj: any): void
  log(message: any, obj: any, context: string): void
  log(message: any, ...args: any[]): void {
    const { msg, context, err, data } = this.prepareLogData(message, ...args)

    const contextMsg = msg ? `[${context}] ${msg}` : `[${context}]`

    this.pino.info({ msg: contextMsg, err, data })
  }

  warn(message: any): void
  warn(message: any, context: string): void
  warn(message: any, obj: any): void
  warn(message: any, obj: any, context: string): void
  warn(message: any, ...args: any[]): void {
    const { msg, context, err, data } = this.prepareLogData(message, ...args)

    const contextMsg = msg ? `[${context}] ${msg}` : `[${context}]`

    this.pino.warn({ msg: contextMsg, err, data })
  }

  debug(message: any): void
  debug(message: any, context: string): void
  debug(message: any, obj: any): void
  debug(message: any, obj: any, context: string): void
  debug(message: any, ...args: any[]): void {
    const { msg, context, err, data } = this.prepareLogData(message, ...args)

    const contextMsg = msg ? `[${context}] ${msg}` : `[${context}]`

    this.pino.debug({ msg: contextMsg, err, data })
  }

  verbose(message: any): void
  verbose(message: any, context: string): void
  verbose(message: any, obj: any): void
  verbose(message: any, obj: any, context: string): void
  verbose(message: any, ...args: any[]): void {
    const { msg, context, err, data } = this.prepareLogData(message, ...args)

    const contextMsg = msg ? `[${context}] ${msg}` : `[${context}]`

    this.pino.trace({ msg: contextMsg, err, data })
  }

  private prepareLogData(...args: any[]) {
    try {
      const len = args.length
      if (len === 0) {
        return {
          msg: undefined,
          context: undefined,
          err: undefined,
          data: undefined,
        }
      }

      let msg: any, err: Error | undefined, data: any
      const context = args[len - 1]

      for (let i = 0; i < len - 1; i++) {
        const v = args[i]

        if (v === null || typeof v === 'string' || typeof v === 'number') {
          if (msg === undefined) {
            msg = v
          }
        } else if (v instanceof Error) {
          if (err === undefined) {
            err = v
          }
        } else {
          if (data === undefined) {
            data = v
          }
        }
      }

      if (data && typeof data === 'object' && !Array.isArray(data) && !err) {
        const errorField =
          data.err instanceof Error
            ? data.err
            : data.error instanceof Error
              ? data.error
              : undefined

        if (errorField) {
          err = errorField
          const { err: _err, error: _error, ...restData } = data
          data = Object.keys(restData).length > 0 ? restData : undefined
        }
      }

      return { msg, context, err, data }
    } catch (error) {
      this.pino.error('error from logger prepareLogData', error)
      throw error
    }
  }

  //
  /**
   * Log example - [03/08/2021, 21:02:01 UTC] INFO (1234): [BonusExpirySchedulerService] exampleText
   * 
   * [03/08/2021, 21:01:32 UTC] INFO (1234): [BonusExpirySchedulerService]
     example: 32
   */
}
