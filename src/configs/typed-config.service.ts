import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from './nest-env-config'

@Injectable()
export class TypedConfigService extends ConfigService<EnvironmentVariables> {
  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K]
  get<K extends keyof EnvironmentVariables>(
    key: K,
    defaultValue: EnvironmentVariables[K],
  ): EnvironmentVariables[K]
  get(key: any, defaultValue?: any) {
    return super.get(key, defaultValue)
  }
}
