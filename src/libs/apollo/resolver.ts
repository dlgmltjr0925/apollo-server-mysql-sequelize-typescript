import {
  Args,
  Mutation,
  MutationResolver,
  Query,
  QueryResolver,
  Resolve,
  Subscription,
  SubscriptionResolve,
  SubscriptionResolver
} from '../../libs/graphql/types';
import {
  RESOLVERS_DATABASES_DIR,
  RESOLVERS_EXTENDS_DIR
} from '../../constants/path';

import fs from 'fs';

type Resolver<TArgs, TReturn> =
  | MutationResolver<TArgs, TReturn>
  | SubscriptionResolver<TArgs, TReturn>
  | QueryResolver<TArgs, TReturn>;

interface ResolversParent {
  [fieldName: string]: Resolve<any, any> | SubscriptionResolve<any, any>;
}

interface Resolvers {
  [parent: string]: ResolversParent;
}

interface GraphqlSchema {
  returnType: string;
  args: Args<any>;
}

interface GraphqlSchemasParent {
  [parent: string]: GraphqlSchema;
}

interface GraphqlSchemas {
  [parent: string]: GraphqlSchemasParent;
}

const resolvers: Resolvers = {};
const graphqlSchemas: GraphqlSchemas = {};

export const getResolvers = async () => {
  if (Object.keys(resolvers).length !== 0) return resolvers;

  await readFiles(RESOLVERS_DATABASES_DIR, resolvers, graphqlSchemas);

  await readFiles(RESOLVERS_EXTENDS_DIR, resolvers, graphqlSchemas);

  return resolvers;
};

export const getGraphqlSchemas = async () => {
  return graphqlSchemas;
};

const readFiles = async (path: string, resolvers: any, graphqlSchemas: any) => {
  if (!fs.existsSync(path)) return;
  const parentList = fs.readdirSync(path);
  for (let i = 0; i < parentList.length; i++) {
    const childList = fs.readdirSync(`${path}/${parentList[i]}/`);
    for (let j = 0; j < childList.length; j++) {
      const options = require(`${path}/${parentList[i]}/${childList[j]}`)
        .default;
      let resolverInstance;
      if (!options) continue;
      if (options.parent === 'Mutation') {
        resolverInstance = new Mutation<any, any>(options);
      } else if (options.parent === 'Subscription') {
        resolverInstance = new Subscription<any, any>(options);
      } else {
        resolverInstance = new Query<any, any>(options);
      }
      const resolver: Resolver<any, any> = resolverInstance.getResolver();
      const { parent, fieldName, returnType, args, resolve } = resolver;
      if (!resolvers[parent]) {
        resolvers[parent] = {};
        graphqlSchemas[parent] = {};
      }
      resolvers[parent][fieldName] = resolve;
      graphqlSchemas[parent][fieldName] = { returnType, args };
    }
  }
};

export default {
  getResolvers,
  getGraphqlSchemas
};
