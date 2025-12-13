import { Injectable } from '@nestjs/common'
import { Counter, Gauge, Histogram, Summary } from 'prom-client'

@Injectable()
export class MetricsService {
  readonly customCounter: Counter<string>
  readonly customGauge: Gauge<string>
  readonly customHistogram: Histogram<string>
  readonly customSummary: Summary<string>

  constructor() {
    // Counter
    this.customCounter = new Counter({
      name: 'custom_counter',
      help: 'Example of a custom counter',
      labelNames: ['method', 'status'],
    })

    // Gauge
    this.customGauge = new Gauge({
      name: 'custom_gauge',
      help: 'Example of a custom gauge',
      labelNames: ['method', 'status'],
    })

    // Histogram
    this.customHistogram = new Histogram({
      name: 'custom_histogram',
      help: 'Example of a custom histogram',
      buckets: [0.1, 0.5, 1, 5, 10],
      labelNames: ['method', 'status'],
    })

    // Summary
    this.customSummary = new Summary({
      name: 'custom_summary',
      help: 'Example of a custom summary',
      percentiles: [0.5, 0.9, 0.99],
      labelNames: ['method', 'status'],
    })
  }
}
