import { Module } from '@nestjs/common'
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus'

import { MetricsService } from './metrics.service'

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: 'custom_counter',
      help: 'Example of a custom counter',
      labelNames: ['method', 'status'],
    }),
    makeGaugeProvider({
      name: 'custom_gauge',
      help: 'Example of a custom gauge',
      labelNames: ['method', 'status'],
    }),
    makeHistogramProvider({
      name: 'custom_histogram',
      help: 'Example of a custom histogram',
      buckets: [0.1, 0.5, 1, 5, 10],
      labelNames: ['method', 'status'],
    }),
    makeSummaryProvider({
      name: 'custom_summary',
      help: 'Example of a custom summary',
      percentiles: [0.5, 0.9, 0.99],
      labelNames: ['method', 'status'],
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
