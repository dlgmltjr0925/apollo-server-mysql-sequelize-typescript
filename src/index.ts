import { ApolloServer } from 'apollo-server';
import cluster from 'cluster';
import configs from './configs';
import log from './utils/log';
import server from './utils/server';

const master = async (): Promise<void> => {
  if (configs.cluster.count <= 1) worker();
  else {
    for (let i = 0; i < configs.cluster.count; i++) {
      const worker = cluster.fork();
      worker.on('exit', (code, signal) => {
        log.f(code, signal);
      });
    }
  }
};

const worker = async (): Promise<void> => {
  const configs = await server.getServerConfigs();

  const apolloServer = new ApolloServer(configs);
  const { url, subscriptionsUrl } = await apolloServer.listen();
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
