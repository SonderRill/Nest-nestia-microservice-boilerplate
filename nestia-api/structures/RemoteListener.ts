export interface RemoteListener {
  onSuccessConnection(message: string): Promise<void>
}
