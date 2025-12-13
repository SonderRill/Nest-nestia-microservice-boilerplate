import * as cluster from 'node:cluster'
import { availableParallelism } from 'node:os'

import { bootstrap } from 'src/boostrap'

// Number of workers can be configured through the environment variable
const numWorkers = process.env.CLUSTER_WORKERS
  ? parseInt(process.env.CLUSTER_WORKERS, 10)
  : availableParallelism()

// Protection from infinite restart: maximum number of restarts per minute
const MAX_RESTARTS_PER_MINUTE = 10
let restartTimestamps: number[] = []

// Flag to prevent race conditions during shutdown
let isShuttingDown = false

function shouldRestart(): boolean {
  if (isShuttingDown) {
    return false
  }

  const now = Date.now()
  const oneMinuteAgo = now - 60_000

  // Remove old entries (O(n), but acceptable with small limit)
  restartTimestamps = restartTimestamps.filter((ts) => ts >= oneMinuteAgo)

  // Check limit
  if (restartTimestamps.length >= MAX_RESTARTS_PER_MINUTE) {
    return false
  }

  restartTimestamps.push(now)
  return true
}

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`)
  console.log(`Starting ${numWorkers} worker(s)`)

  // Track worker readiness
  const readyWorkers = new Set<number>()

  // Function to setup worker handlers
  const setupWorkerHandlers = (worker: cluster.Worker) => {
    const workerPid = worker.process.pid
    if (!workerPid) {
      return
    }

    // Handle messages from worker about readiness (modern style)
    worker.on('message', (message: unknown) => {
      if (message === 'ready') {
        readyWorkers.add(workerPid)
        console.log(`Worker ${workerPid} is ready`)
      }
    })
  }

  // Create worker processes
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork()
    setupWorkerHandlers(worker)
    console.log(`Worker ${worker.process.pid} started (waiting for ready...)`)
  }

  // Handle worker process exit
  cluster.on('exit', (worker, code, signal) => {
    // Ignore exit events during shutdown
    if (isShuttingDown) {
      return
    }

    const workerPid = worker.process.pid
    if (!workerPid) {
      return
    }

    // Don't restart on normal exit (code === 0)
    if (code === 0) {
      console.log(`Worker ${workerPid} exited normally (code: ${code})`)
      readyWorkers.delete(workerPid)
      return
    }

    console.log(`Worker ${workerPid} died (code: ${code}, signal: ${signal})`)
    readyWorkers.delete(workerPid)

    if (shouldRestart()) {
      console.log('Starting a new worker')
      const newWorker = cluster.fork()
      setupWorkerHandlers(newWorker)
      console.log(
        `Worker ${newWorker.process.pid} started (waiting for ready...)`,
      )
    } else {
      console.error(
        'Too many restarts detected. Stopping automatic restart to prevent infinite loop.',
      )
      console.error('Please check your application for errors.')
    }
  })

  // Graceful shutdown: handle termination signals
  const shutdown = (signal: string) => {
    // Prevent multiple shutdown calls
    if (isShuttingDown) {
      return
    }

    isShuttingDown = true
    console.log(`Received ${signal}, shutting down gracefully...`)

    // Disable automatic restart
    cluster.removeAllListeners('exit')

    // Collect all active workers into array for safe iteration
    const workers = Object.values(cluster.workers || {}).filter(
      (worker): worker is cluster.Worker => worker !== undefined,
    )

    if (workers.length === 0) {
      console.log('No active workers, exiting immediately')
      process.exit(0)
    }

    console.log(`Shutting down ${workers.length} worker(s)...`)

    // Close all workers
    let exitedWorkers = 0
    const totalWorkers = workers.length

    const checkExit = () => {
      exitedWorkers++
      if (exitedWorkers >= totalWorkers) {
        console.log('All workers exited, master process exiting')
        process.exit(0)
      }
    }

    // Track worker exit
    cluster.on('exit', checkExit)

    // Send signal to all workers
    for (const worker of workers) {
      if (worker && !worker.isDead()) {
        console.log(`Shutting down worker ${worker.process.pid}`)
        worker.kill(signal)
      } else {
        checkExit()
      }
    }

    // Timeout in case workers don't exit gracefully
    setTimeout(() => {
      console.log('Timeout reached, forcing exit')
      process.exit(0)
    }, 10000)
  }

  // Handle termination signals (only once)
  process.once('SIGTERM', () => shutdown('SIGTERM'))
  process.once('SIGINT', () => shutdown('SIGINT'))
} else {
  // Worker process
  bootstrap().catch((error) => {
    console.error(`Worker ${process.pid} failed to start:`, error)
    process.exit(1)
  })
}
