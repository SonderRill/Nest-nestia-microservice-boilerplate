import { randomUUID } from 'node:crypto'

import { WebSocketRoute } from '@nestia/core'
import { Controller, Logger } from '@nestjs/common'
import { Driver, WebSocketAcceptor } from 'tgrid'

import { NestListener } from '../../nestia-api/structures/NestListener'
import { RemoteListener } from '../../nestia-api/structures/RemoteListener'
import { NestWebSocketRpcListener } from './nest-websocket-rpc-listener'
import { WebSocketRpcService } from './websocket-rpc.service'

@Controller()
export class WebSocketRpcController {
  private readonly logger = new Logger(WebSocketRpcController.name)

  constructor(private readonly webSocketRpcService: WebSocketRpcService) {}

  /**
   * Never log the driver object, it returns an error from the frontend to the backend logs, because it is a ProxyObject
   */
  /**
   * @summary Connect to the WebSocket server
   * @tag WebSocketRpc
   */
  @WebSocketRoute('connect')
  public async connect(
    @WebSocketRoute.Acceptor()
    acceptor: WebSocketAcceptor<any, NestListener, RemoteListener>,
    @WebSocketRoute.Driver() driver: Driver<RemoteListener>,
    @WebSocketRoute.Header()
    _header: any,
  ): Promise<void> {
    try {
      const clientId = randomUUID()
      this.logger.log(`try to connect Listener ${clientId}`)

      /**
       * Some auth logic here. You can use acceptor.reject for reject the connection.
       */
      // if (header.xAuthToken !== this.xAuthToken) {
      //   this.logger.error(`Invalid token: ${header.xAuthToken}`)
      //   // works only if the status is greater than 999 https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
      //   return acceptor.reject(1008, 'Invalid token')
      // }

      await acceptor.accept(new NestWebSocketRpcListener())

      /**
       * Add instance of listener application to the list of connected clients
       */
      this.webSocketRpcService.add(clientId, driver)

      setTimeout(async () => {
        await this.webSocketRpcService.onSuccessConnection(
          'Connection successful',
        )
      }, 1500)

      acceptor.ping(15_000)
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}
