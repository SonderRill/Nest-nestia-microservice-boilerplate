import { availableParallelism } from 'node:os'

import * as Joi from 'joi'

export const environmentVariables = {
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
} as const

type InferJoiSchema<T> =
  T extends Joi.StringSchema<infer U>
    ? U
    : T extends Joi.NumberSchema<infer U>
      ? U
      : T extends Joi.BooleanSchema<infer U>
        ? U
        : T extends Joi.ArraySchema<infer U>
          ? U
          : T extends Joi.ObjectSchema<infer U>
            ? U
            : unknown

export type EnvironmentVariables = {
  [K in keyof typeof environmentVariables]: InferJoiSchema<
    (typeof environmentVariables)[K]
  >
}
