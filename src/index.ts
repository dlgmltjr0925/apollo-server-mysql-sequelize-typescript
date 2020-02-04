import { ApolloServer } from 'apollo-server';
import Server from './Server';
import cluster from 'cluster';
import configs from './configs';
import log from './utils/log';

const master = async (): Promise<void> => {
  for (let i = 0; i < configs.cluster.count; i++) {
    const worker = cluster.fork();
    worker.on('exit', (code, signal) => {
      log.f(code, signal);
    });
  }
};

const worker = async (): Promise<void> => {
  const options = await Server.getOptions();

  const server = new ApolloServer(options);
  const { url, subscriptionsUrl } = await server.listen();
  log.i(`🚀 Server ready at ${url}`);
  log.i(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
};

if (cluster.isMaster) {
  master();
  cluster.on('online', worker => {
    log.i(`Forked worker's ID : ${worker.process.pid}`);
  });
} else {
  worker();
}
