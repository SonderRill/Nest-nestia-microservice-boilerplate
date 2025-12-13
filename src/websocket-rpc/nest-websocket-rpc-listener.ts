import { NestListener } from '../../nestia-api/structures/NestListener'

export class NestWebSocketRpcListener implements NestListener {
  public ping(): 'pong' {
    return 'pong'
  }
}
