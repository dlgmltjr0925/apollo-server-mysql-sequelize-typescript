import { Stores, createStores } from '../../libs/sequelize';
import { getSchemas, getTypeDefs } from '../../libs/apollo/schema';

import { ApolloServerExpressConfig } from 'apollo-server-express';
import { ExpressContext } from 'apollo-server-express/src/ApolloServer';
import { PubSub } from 'apollo-server';
import { createGraphqlSchemasFromStore } from '../../libs/graphql';
import { getResolvers } from '../../libs/apollo/resolver';
import log from '../../utils/log';

interface ServerConfigs<TContext>
  extends Omit<ApolloServerExpressConfig, 'context'> {
  context: ContextFunction<TContext>;
}

export interface BaseContext {
  stores: Stores;
  resolvers: any;
  typeDefs: any;
}

export type ContextFunction<T> = (
  context: ExpressContext,
  baseContext: BaseContext
) => Promise<T>;

export class Server<TContext> {
  context: ContextFunction<TContext>;
  configs?: ServerConfigs<TContext>;
  constructor(context: ContextFunction<TContext>) {
    this.context = context;
  }

  public setContext = (context: ContextFunction<TContext>) => {
    this.context = context;
  };

  public getServerConfigs = async (): Promise<ServerConfigs<TContext>> => {
    if (this.configs) return this.configs;
    const stores = await createStores();

    const graphqlSchemas = await createGraphqlSchemasFromStore(stores);
    const graphqlSchemaNames = Object.keys(graphqlSchemas);

    const schemas = getSchemas();
    graphqlSchemaNames.map(name => {
      schemas[name] = graphqlSchemas[name];
    });

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

    const context: ContextFunction<TContext> = async context => {
      return await this.context(context, { stores, resolvers, typeDefs });
    };

    this.configs = {
      context,
      resolvers,
      typeDefs,
      subscriptions
    };

    return this.configs;
  };
}
