import * as cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

import { bootstrap } from 'src/boostrap';

const numCPUs = availableParallelism();

if ((cluster as any).isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Создаем рабочие процессы
  for (let i = 0; i < numCPUs; i++) {
    (cluster as any).fork();
  }

  // Обработка завершения рабочего процесса
  (cluster as any).on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    (cluster as any).fork();
  });
} else {
  bootstrap().catch(() => {
    console.error(`Worker ${process.pid} failed to start`);
    process.exit(1);
  });
}
