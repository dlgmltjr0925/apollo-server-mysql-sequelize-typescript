import { BaseContext, ContextFunction, Server } from '../libs/apollo/server';

import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import client from './client';

export interface Context extends BaseContext {
  user: {
    token: string;
  };
  client: ApolloClient<NormalizedCacheObject>;
}

const context: ContextFunction<Context> = async (context, baseContext) => {
  const { req } = context;

  const token = req.headers.authorization || '';
  const user = {
    token
  };

  return {
    ...baseContext,
    user,
    client
  };
};

const server = new Server<Context>(context);

export default server;
