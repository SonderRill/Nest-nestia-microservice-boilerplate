import { INestiaConfig } from '@nestia/sdk'

import { OPENAPI_BASE } from './src/openapi-base.const'

// @Module({
//   imports: [
//     PrismaModule,
//     CqrsModule.forRoot(),
//     PlayerAccountModule,
//     PaymentModule,
//   ],
// })
// export class NestiaModule {}

const NESTIA_CONFIG: INestiaConfig = {
  input: {
    include: ['src/**/*.controller.ts'],
    exclude: ['src/**/*webhook*.controller.ts'],
  },
  swagger: OPENAPI_BASE,
  clone: true,
  e2e: 'test',
  distribute: 'sdk-package/api',
  output: 'nestia-api',
}
export default NESTIA_CONFIG
