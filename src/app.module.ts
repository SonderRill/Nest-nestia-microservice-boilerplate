import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { HttpExceptionFilter } from './common/filters'
import { LoggingInterceptor } from './common/interceptors'
import { config } from './configs/nest-config'
import { ExampleModule } from './example/example.module'
import { ExamplePrismaModule } from './example-prisma/example-prisma.module'
import { HealthModule } from './health/health.module'
import { MetricsModule } from './metrics/metrics.module'
import { PrismaModule } from './prisma/prisma.module'
import { WebSocketRpcModule } from './websocket-rpc'

@Module({
  imports: [
    ConfigModule.forRoot(config),
    PrismaModule,
    MetricsModule,
    HealthModule,
    ExampleModule,
    ExamplePrismaModule,
    WebSocketRpcModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
