import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'

import { PrismaService } from '../prisma/prisma.service'

@Controller('health')
export class HealthController {
  private readonly HEALTHY_MEMORY_HEAP_LIMIT: number
  private readonly HEALTHY_MEMORY_RSS_LIMIT: number
  private readonly HEALTHY_DISC_LIMIT: number

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {
    this.HEALTHY_MEMORY_HEAP_LIMIT = Number(
      this.configService.get<number>('HEALTHY_MEMORY_HEAP_LIMIT'),
    )
    this.HEALTHY_MEMORY_RSS_LIMIT = Number(
      this.configService.get<number>('HEALTHY_MEMORY_RSS_LIMIT'),
    )
    this.HEALTHY_DISC_LIMIT = Number(
      this.configService.get<number>('HEALTHY_DISC_LIMIT'),
    )
  }

  /**
   * @tag Health
   * @summary Health Check
   */
  @Get()
  @HealthCheck()
  async check() {
    // HTTP Health Check
    const pingCheck: HealthIndicatorFunction = () =>
      this.http.pingCheck('pingCheck', 'https://docs.nestjs.com')

    // Prisma Health Check
    const prismaCheck: HealthIndicatorFunction = () =>
      this.prisma.pingCheck('prisma', this.prismaService)

    // Memory Heap Health Check
    const memoryHeapCheck: HealthIndicatorFunction = () => {
      return this.HEALTHY_MEMORY_HEAP_LIMIT
        ? this.memory.checkHeap('memoryHeap', this.HEALTHY_MEMORY_HEAP_LIMIT)
        : { memoryHeap: { status: 'up' } }
    }

    // Memory Rss Health Check
    const memoryRssCheck: HealthIndicatorFunction = () => {
      return this.HEALTHY_MEMORY_RSS_LIMIT
        ? this.memory.checkRSS('memoryRss', this.HEALTHY_MEMORY_RSS_LIMIT)
        : { memoryRss: { status: 'up' } }
    }

    // Disk Health Check
    const diskCheck: HealthIndicatorFunction = () => {
      return this.HEALTHY_DISC_LIMIT
        ? this.disk.checkStorage('disk', {
            path: '/',
            thresholdPercent: this.HEALTHY_DISC_LIMIT,
          })
        : { disk: { status: 'up' } }
    }

    return this.health.check([
      pingCheck,
      prismaCheck,
      memoryHeapCheck,
      memoryRssCheck,
      diskCheck,
    ])
  }
}
