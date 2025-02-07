import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ExampleModule } from 'src/example/example.module';
import { OPENAPI_BASE } from 'src/openapi-base.const';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    return await NestFactory.create(ExampleModule, new FastifyAdapter());
  },
  swagger: {
    ...OPENAPI_BASE,
    beautify: true,
  },
};
export default NESTIA_CONFIG;
