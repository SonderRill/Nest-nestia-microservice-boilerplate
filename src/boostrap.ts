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
import { sanitizeHeaders } from './common/utils'
import { loggerConfig } from './configs/logger.config'
import { OPENAPI_BASE } from './openapi-base.const'

export async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: loggerConfig,
  })

  fastifyAdapter.getInstance().addHook('onResponse', (request, reply, done) => {
    const log: any = request.log

    if (reply.statusCode >= 400 || process.env.NODE_ENV === 'development') {
      if (typeof log.setBindings === 'function') {
        log.setBindings({
          body: request.body,
          query: request.query,
          params: request.params,
          headers: sanitizeHeaders(request.headers),
          url: request.url,
          method: request.method,
        })
      }
    }
    done()
  })

  const fastifyLogger = fastifyAdapter.getInstance().log
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
      logger: new PinoLogger(fastifyLogger),
    },
  )

  const document = await NestiaSwaggerComposer.document(app, OPENAPI_BASE)
  SwaggerModule.setup('api', app, document as any)

  app.register(fastifyMetrics, {
    endpoint: '/metrics',
  })

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 7000)
  const host = configService.get<string>('HOST', '127.0.0.1')

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    fastifyLogger.info(`Received ${signal}, shutting down gracefully...`)
    await app.close()
    process.exit(0)
  }

  process.on('SIGTERM', () => {
    shutdown('SIGTERM').catch((error) => {
      fastifyLogger.error('Error during shutdown:', error)
      process.exit(1)
    })
  })
  process.on('SIGINT', () => {
    shutdown('SIGINT').catch((error) => {
      fastifyLogger.error('Error during shutdown:', error)
      process.exit(1)
    })
  })

  await app.listen(port, host)

  // Send ready message to master process
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
      '.Access to the documentation is available on /api',
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
