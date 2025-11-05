import { Module } from '@nestjs/common'

import { ExamplePrimaController } from './example-prisma.controller'

@Module({
  controllers: [ExamplePrimaController],
})
export class ExamplePrismaModule {}
