import { TypedBody } from '@nestia/core'
import { Controller, Post } from '@nestjs/common'

import { PostModel } from '../../prisma/generated/prisma/models'
import { PrismaService } from '../prisma/prisma.service'

@Controller('post')
export class ExamplePrimaController {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @summary Create post
   * @returns Newly created post
   * @tag DemoPrima
   * @operationId createPost
   * @security bearer
   */
  @Post()
  async createPost(
    @TypedBody()
    { body, email, title }: Pick<PostModel, 'body' | 'email' | 'title'>,
  ): Promise<PostModel> {
    return this.prismaService.post.create({
      data: {
        body,
        email,
        title,
      },
    })
  }
}
