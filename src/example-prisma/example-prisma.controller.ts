import { TypedBody } from '@nestia/core'
import { Controller, Post } from '@nestjs/common'
import { Post as PostNews } from '@prisma/client'

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
    { body, email, title }: Pick<PostNews, 'body' | 'email' | 'title'>,
  ): Promise<PostNews> {
    return this.prismaService.post.create({
      data: {
        body,
        email,
        title,
      },
    })
  }
}
