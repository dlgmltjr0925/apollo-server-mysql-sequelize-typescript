import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import configs from '../configs';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';

export const client = new ApolloClient({
  link: createHttpLink({
    uri: `http://${configs.host}:${configs.port}`,
    fetch
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }
});

export default client;
