import { Stores, checkUpdateState, createStores } from '../libs/sequelize';
import configs, { PERIOD } from '../configs';
import {
  createGraphqlSchemasFromStore,
  createResolversFromStore
} from '../libs/graphql';
import { getSchemas, getTypeDefs } from '../schemas';

import client from '../utils/client';
import { getResolvers } from '../resolvers';
import log from '../utils/log';

interface Context {
  stores: Stores;
}

export interface Options {
  context: Context;
}

interface Server {
  getOptions: () => Promise<Options>;
}

class Server implements Server {
  static update = async () => {
    const stores = await createStores();

    if (
      configs.defaultGenerateOptions.period === PERIOD.ALWAYS ||
      (configs.defaultGenerateOptions.period === PERIOD.AFTER_DB_UPDATE &&
        checkUpdateState())
    ) {
      await createResolversFromStore(stores);
    }
    process.exit(configs.messages.exitAfterUpdate.code);
  };

  static getOptions = async () => {
    const stores = await createStores();

    const graphqlSchemas = await createGraphqlSchemasFromStore(stores);
    const graphqlSchemaNames = Object.keys(graphqlSchemas);

    const schemas = getSchemas();
    graphqlSchemaNames.map(name => {
      schemas[name] = graphqlSchemas[name];
    });

    const context = (context: any) => {
      const { req } = context;
      // TODO get User from req.header. User
      const token = req.headers.authorization || '';
      const user = { token };

      return {
        ...context,
        stores,
        client,
        user
      };
    };

    const resolvers = await getResolvers();

    const typeDefs = await getTypeDefs();

    const subscriptions = {
      onConnect: (connectionParams: any, webSocket: any, context: any) => {
        log.i('Connect subscription');
        log.d(connectionParams, webSocket, context);
      },
      onDisconnect: (webSocket: any, context: any) => {
        log.i('Disconnect subscription');
        log.d(webSocket, context);
      }
    };

    const options = {
      context,
      resolvers,
      typeDefs,
      subscriptions
    };

    return options;
  };
}

export default Server;