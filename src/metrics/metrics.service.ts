import { Injectable } from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Counter, Gauge, Histogram, Summary } from 'prom-client'

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('custom_counter')
    readonly customCounter: Counter<string>,
    @InjectMetric('custom_gauge')
    readonly customGauge: Gauge<string>,
    @InjectMetric('custom_histogram')
    readonly customHistogram: Histogram<string>,
    @InjectMetric('custom_summary')
    readonly customSummary: Summary<string>,
  ) {}
}
