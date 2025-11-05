import type { HealthIndicatorResult } from './HealthIndicatorResult'

/**
 * The result of a health check
 *
 * @publicApi
 */
export type HealthCheckResult = {
  /**
   * The overall status of the Health Check
   */
  status: 'error' | 'ok' | 'shutting_down'

  /**
   * The info object contains information of each health indicator
   * which is of status "up"
   */
  info?: undefined | HealthIndicatorResult

  /**
   * The error object contains information of each health indicator
   * which is of status "down"
   */
  error?: undefined | HealthIndicatorResult

  /**
   * The details object contains information of every health indicator.
   */
  details: HealthIndicatorResult
}
