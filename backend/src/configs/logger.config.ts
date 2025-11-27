import { ConfigService } from '@nestjs/config'
import { FastifyServerOptions } from 'fastify'
import pino from 'pino'
import { LokiOptions } from 'pino-loki'

import * as packageJson from '../../package.json'

const config = new ConfigService()

const targets: pino.TransportTargetOptions[] = []

const LOG_LEVEL = config.get('LOG_LEVEL', 'debug')
const ENABLE_CONSOLE_LOGGING = config.get('ENABLE_CONSOLE_LOGGING', 'true')

if (config.get('LOKI_URL')) {
  targets.push({
    target: 'pino-loki',
    level: LOG_LEVEL,
    options: {
      translateTime: 'dd/mm/yyyy, HH:MM:ss Z',
      batching: true, // Должны ли журналы отправляться в пакетном режиме. По умолчанию true.
      interval: 5, // Интервал отправки пакетных журналов в секундах. По умолчанию 5.
      labels: {
        // Дополнительные метки, которые будут добавлены во все журналы Loki
        app: packageJson.name,
        env: config.get('NODE_ENV'),
      },
      host: config.get('LOKI_URL'),
      ...(config.get('LOKI_USERNAME') && {
        basicAuth: {
          username: config.get('LOKI_USERNAME'),
          password: config.get('LOKI_PASSWORD'),
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

export const loggerConfig: FastifyServerOptions['logger'] = {
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
