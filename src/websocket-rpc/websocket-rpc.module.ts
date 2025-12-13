import { Module } from '@nestjs/common'

import { WebSocketRpcController } from './websocket-rpc.controller'
import { WebSocketRpcService } from './websocket-rpc.service'

@Module({
  controllers: [WebSocketRpcController],
  providers: [WebSocketRpcService],
  exports: [WebSocketRpcService],
})
export class WebSocketRpcModule {}
