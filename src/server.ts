import * as cluster from 'cluster';
import * as os from 'os';
import * as config from '../src/config/';

import * as passport from 'passport';

// Loading Config
(async () => {
  await config.initiate();
})();
import App from './app';
import UserController from './controllers/user/user.controller';

const clusterEnable = process.env.CLUSTER === 'false' ? false : true;
console.log(' Cluster Mode' + clusterEnable);
if (cluster.isMaster && clusterEnable) {
  const numWorkers = os.cpus().length;
  console.log('Master cluster setting up ' + numWorkers + ' workers...');
  for (let i: number = 0; i < numWorkers; i += 1) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker ' +
      worker.process.pid +
      ' died with code: ' +
      code +
      ', and signal: ' +
      signal,
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const app = new App([
    new UserController(),
  ]);
  app.listen();
}
