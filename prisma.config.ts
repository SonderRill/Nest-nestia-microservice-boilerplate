import 'dotenv/config'

import path from 'node:path'

import type { PrismaConfig } from 'prisma'

export default {
  schema: path.join('prisma', 'schema.prisma'),
  experimental: {
    // externalTables: true,
  },
  tables: {},
  enums: {},
  migrations: {
    // setup the users table for the shadow database
  },
} satisfies PrismaConfig
