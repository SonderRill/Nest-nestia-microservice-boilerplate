import * as dotenv from 'dotenv'
import { LoggerOptions, TransportTargetOptions } from 'pino'
import { LokiOptions } from 'pino-loki'

import * as packageJson from '../../package.json'

dotenv.config()

const targets: TransportTargetOptions[] = []

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug'
const ENABLE_CONSOLE_LOGGING = process.env.ENABLE_CONSOLE_LOGGING || 'true'

if (process.env.LOKI_URL) {
  targets.push({
    target: 'pino-loki',
    level: LOG_LEVEL,
    options: {
      batching: {
        interval: 5,
        maxBufferSize: 10_000,
      },
      labels: {
        app: packageJson.name,
        env: process.env.NODE_ENV as string,
      },
      host: process.env.LOKI_URL,
      ...(process.env.LOKI_USERNAME && {
        basicAuth: {
          username: process.env.LOKI_USERNAME,
          password: process.env.LOKI_PASSWORD || '',
        },
      }),
    } satisfies LokiOptions,
  })
}

if (ENABLE_CONSOLE_LOGGING === 'true') {
  targets.push({
    target: 'pino-pretty',
    level: LOG_LEVEL,
    options: {
      messageKey: 'msg',
      translateTime: 'dd/mm/yyyy, HH:MM:ss Z',
    },
  })
}

export const loggerConfig: LoggerOptions = {
  level: LOG_LEVEL,
  messageKey: 'msg',
  errorKey: 'err',
  formatters: {
    log: ({ msg, ...object }) => {
      return {
        msg,
        ...object,
      }
    },
  },
  transport: {
    targets,
  },
}
