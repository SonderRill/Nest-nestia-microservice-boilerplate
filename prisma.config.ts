import 'dotenv/config'

import path from 'node:path'

import { defineConfig } from 'prisma/config'

/**
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 * Using env() requires the variable to be present, otherwise an error occurs. This prevents the Dockerfile from being built, as it doesn't have access to env variables.
 */
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
})
