import { NestiaSwaggerComposer } from '@nestia/sdk'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { SwaggerModule } from '@nestjs/swagger'
import fastifyMetrics from 'fastify-metrics'

import { AppModule } from './app.module'
import { PinoLogger } from './common/services/pino-logger.service'
import { loggerConfig } from './configs/logger.config'
import { OPENAPI_BASE } from './openapi-base.const'

export async function bootstrap() {
  /**
   * Fastify
   */
  const fastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: loggerConfig,
  })
  const fastifyLogger = fastifyAdapter.getInstance().log

  /**
   * NestFactory
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
      logger: new PinoLogger(fastifyLogger),
    },
  )

  /**
   * Nestia Swagger
   */
  const document = await NestiaSwaggerComposer.document(app, OPENAPI_BASE)
  SwaggerModule.setup('api', app, document as any)

  /**
   * Fastify Metrics
   */
  app.register(fastifyMetrics, {
    endpoint: '/metrics',
  })

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 7000)
  const host = configService.get<string>('HOST', '127.0.0.1')

  await app.listen(port, host)

  /**
   * Send ready message to master process
   */
  if (process.send) {
    process.send('ready')
  }

  const enableConsoleLogging = configService.get<boolean>(
    'ENABLE_CONSOLE_LOGGING',
    true,
  )
  fastifyLogger.info(
    'Application started on ' +
      host +
      ':' +
      port +
      '. Access to the documentation is available on /api',
  )
  if (!enableConsoleLogging) {
    console.log(
      'Nest application successfully started on ' +
        host +
        ':' +
        port +
        '.\n Access to the documentation is available on /api',
    )
  }
}
