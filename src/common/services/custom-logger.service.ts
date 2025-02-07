import { LoggerService } from '@nestjs/common';
import { FastifyBaseLogger } from 'fastify';
import pino from 'pino';

export class CustomLoggerService implements LoggerService {
  readonly error: pino.LogFn;
  readonly log: pino.LogFn;
  readonly warn: pino.LogFn;
  readonly debug: pino.LogFn;
  readonly verbose: pino.LogFn;

  constructor(private readonly logger: FastifyBaseLogger) {
    this.error = this.logger.error.bind(this.logger);
    this.log = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.verbose = this.logger.trace.bind(this.logger);
  }
}
