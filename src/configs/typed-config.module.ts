import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TypedConfigService } from './typed-config.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
  exports: [TypedConfigService],
})
export class TypedConfigModule {}
