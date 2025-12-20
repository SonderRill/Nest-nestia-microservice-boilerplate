import { randomUUID } from 'node:crypto'

import { NestiaSwaggerComposer } from '@nestia/sdk'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { SwaggerModule } from '@nestjs/swagger'
import fastifyMetrics from 'fastify-metrics'

import { AppModule } from './app.module'
import { PinoLogger } from './common/services'
import { loggerConfig, TypedConfigService } from './configs'
import { OPENAPI_BASE } from './openapi-base.const'

export async function bootstrap() {
  /**
   * Fastify
   */
  const fastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: loggerConfig,
    // implemented in logging.interceptor.ts
    disableRequestLogging: true,
    genReqId: () => randomUUID(),
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

  /**
   * Start server
   */
  const configService = app.get(TypedConfigService)
  const port = configService.get('PORT', 7000)
  const host = configService.get('HOST', '127.0.0.1')

  await app.listen(port, host)

  /**
   * Send ready message to master process
   */
  if (process.send) {
    process.send('ready')
  }

  const enableConsoleLogging = configService.get('ENABLE_CONSOLE_LOGGING', true)

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
        '.\nAccess to the documentation is available on /api',
    )
  }
}
