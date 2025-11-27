import { ConfigModuleOptions } from '@nestjs/config'
import * as Joi from 'joi'

export const config: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().port().default(3000),
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
