import {
  RESOLVERS_DATABASES_DIR,
  RESOLVERS_EXTENDS_DIR
} from '../constants/path';

import fs from 'fs';
import log from '../utils/log';

const resolvers = {};
const graphqlSchemas = {};

export const getResolverWithLifecycle = (resolve: any) => {
  return async (parent: any, args: any, context: any, info: any) => {
    const { fieldName } = info;
    const start = new Date();

    // TODO before hook
    const result = await resolve(parent, args, context, info);
    const end = new Date();
    log.i(`[${fieldName}]`, (end.valueOf() - start.valueOf()) / 1000 + 's');

    // TODO after hook
    return result;
  };
};

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
  const parentList = fs.readdirSync(path);
  for (let i = 0; i < parentList.length; i++) {
    if (!resolvers[parentList[i]]) {
      resolvers[parentList[i]] = {};
      graphqlSchemas[parentList[i]] = {};
    }
    const childList = fs.readdirSync(`${path}/${parentList[i]}/`);
    for (let j = 0; j < childList.length; j++) {
      const resolveObj = require(`${path}/${parentList[i]}/${childList[j]}`)
        .default;
      const { parent, filedName, returnType, args, resolve } = resolveObj;
      resolvers[parent][filedName] =
        parent === 'Subscription' ? resolve : getResolverWithLifecycle(resolve);
      graphqlSchemas[parent][filedName] = { returnType, args };
    }
  }
};

export default {
  getResolvers,
  getGraphqlSchemas
};
