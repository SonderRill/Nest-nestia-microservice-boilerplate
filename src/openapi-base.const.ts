import { INestiaConfig } from '@nestia/sdk';

export const OPENAPI_BASE: INestiaConfig.ISwaggerConfig = {
  output: 'dist/swagger.json',
  openapi: '3.1',
  info: {
    contact: {
      email: 'contact@nestjs.com',
      name: 'NestJS API contact name',
      url: 'https://nestjs.com',
    },
    description: 'NestJS API documentation',
    version: '1.0',
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT',
      identifier: 'MIT License',
    },
    summary: 'NestJS API summary',
    termsOfService: 'https://ya.ru',
    title: 'NestJS API',
  },
  security: {
    bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
      description: 'Local Server',
    },
  ],
};
