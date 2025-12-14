import { availableParallelism } from 'node:os'

import { ConfigModuleOptions } from '@nestjs/config'
import * as Joi from 'joi'

export const config: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().port().default(7000),
    HOST: Joi.string().default('0.0.0.0'),
    CLUSTER_WORKERS: Joi.number().default(Math.max(1, availableParallelism())),
    LOKI_URL: Joi.string().uri().allow(''),
    LOKI_USERNAME: Joi.string().allow(''),
    LOKI_PASSWORD: Joi.string().allow(''),
    HEALTHY_MEMORY_HEAP_LIMIT: Joi.number().allow(''),
    HEALTHY_MEMORY_RSS_LIMIT: Joi.number().allow(''),
    HEALTHY_DISC_LIMIT: Joi.number().allow(''),
    DATABASE_URL: Joi.string().required(),
    ENABLE_CONSOLE_LOGGING: Joi.boolean().default(true),
    LOG_LEVEL: Joi.string()
      .valid('silent', 'error', 'warn', 'info', 'debug')
      .default('debug'),
  }),
}
