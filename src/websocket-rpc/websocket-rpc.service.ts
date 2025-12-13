import { Injectable, Logger } from '@nestjs/common'
import { Driver } from 'tgrid'

import { RemoteListener } from '../../nestia-api/structures/RemoteListener'

/**
 * Service for sending messages to all connected listeners
 */
@Injectable()
export class WebSocketRpcService implements RemoteListener {
  private readonly logger = new Logger(WebSocketRpcService.name)
  private clients: Map<string, Driver<RemoteListener>> = new Map()

  add(id: string, client: Driver<RemoteListener>): void {
    this.logger.log(`add Listener ${id}`)
    this.clients.set(id, client)
  }

  remove(id: string): void {
    this.logger.log(`remove Listener ${id}`)
    this.clients.delete(id)
  }

  async onSuccessConnection(message: string): Promise<void> {
    const failed: string[] = []

    for (const [id, driver] of this.clients) {
      try {
        await driver.onSuccessConnection(message)
      } catch (error) {
        this.logger.error(error)
        failed.push(id)
      }
    }

    /**
     * Remove "dead" connections from the list of connected clients
     */
    for (const driver of failed) {
      this.remove(driver)
    }
  }
}
