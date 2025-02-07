import { NestiaSwaggerComposer } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import fastifyMetrics from 'fastify-metrics';

import { AppModule } from './app.module';
import { CustomLoggerService } from './common/services/custom-logger.service';
import { loggerConfig } from './configs/logger.config';
import { OPENAPI_BASE } from './openapi-base.const';

export async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: loggerConfig,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
      logger: new CustomLoggerService(fastifyAdapter.getInstance().log),
    },
  );

  const document = await NestiaSwaggerComposer.document(app, OPENAPI_BASE);
  SwaggerModule.setup('api', app, document as any);

  // @ts-expect-error fastify-metrics versions higher than 8.0.0 conflict with Nest in typing but work properly.
  app.register(fastifyMetrics, {
    endpoint: '/metrics',
  });

  await app.listen(process.env.PORT ?? 3000);

  if (process.env.ENABLE_CONSOLE_LOGGING !== 'true') {
    console.log('Nest application successfully started');
  }
}
