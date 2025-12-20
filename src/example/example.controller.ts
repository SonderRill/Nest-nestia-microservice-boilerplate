import { TypedBody, TypedQuery } from '@nestia/core'
import { Controller, Get, Logger, Post } from '@nestjs/common'

import { HelloQuery } from './dto/hello.query'
import { HelloResponse } from './dto/hello.response'
import { PowerRequest } from './dto/power.request'
import { PowerResponse } from './dto/power.response'

@Controller()
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name)

  /**
   * It can be used to store multiline method<br/>
   * with HTML markup
   * @summary The description line shown in the endpoints list
   * @param section Section code
   * @param input Content to store
   * @returns Newly archived article
   * @tag Demo Some description describing demo group...
   * @operationId getHello
   * @security bearer
   */
  @Get()
  async getHello(
    @TypedQuery() { text, num }: HelloQuery,
  ): Promise<HelloResponse> {
    this.logger.debug('log')
    return { text: `${text || 'Hello'} ${num === void 0 ? 1 : num}` }
  }

  /**
   * @operationId power
   * @tag Demo
   * @security bearer
   */
  @Post()
  async power(@TypedBody() body: PowerRequest): Promise<PowerResponse> {
    const { number, degree } = body
    return { result: Math.pow(number, degree) }
  }
}
