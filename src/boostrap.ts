import { NestiaSwaggerComposer } from '@nestia/sdk'
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
    http2: true,
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

  const port = process.env.PORT ?? 3000
  const host = process.env.HOST ?? '127.0.0.1'
  await app.listen(port, host)

  if (process.env.ENABLE_CONSOLE_LOGGING !== 'true') {
    console.log(
      'Nest application successfully started on ' +
        host +
        ':' +
        port +
        '.\nAccess to the documentation is available on /api',
    )
  }
}
