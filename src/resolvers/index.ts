import {
  RESOLVERS_DATABASES_DIR,
  RESOLVERS_EXTENDS_DIR
} from '../constants/path';

import camelCase from 'camelcase';
import fs from 'fs';
import hooks from '../hooks';
import log from '../utils/log';

const resolvers = {};
const graphqlSchemas = {};

export const getResolverWithLifecycle = (resolve: any, filedName: string) => {
  const beforeHook =
    hooks[`before${camelCase(filedName, { pascalCase: true })}`];
  const afterHook = hooks[`after${camelCase(filedName, { pascalCase: true })}`];

  return async (parent: any, args: any, context: any, info: any) => {
    try {
      const { fieldName } = info;
      const start = new Date();

      try {
        if (beforeHook) await beforeHook(parent, args, context, info);
      } catch (error) {
        log.e(error);
        throw error;
      }

      log.i(`[${fieldName}]`);
      const result = await resolve(parent, args, context, info);

      try {
        if (afterHook) afterHook(parent, args, context, info);
      } catch (error) {
        log.e(error);
        throw error;
      }

      const end = new Date();
      log.i(`[${fieldName}]`, (end.valueOf() - start.valueOf()) / 1000 + 's');
      return result;
    } catch (error) {
      log.e(error);
      throw error;
    }
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
  if (!fs.existsSync(path)) return;
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
        parent === 'Subscription'
          ? resolve
          : getResolverWithLifecycle(resolve, filedName);
      graphqlSchemas[parent][filedName] = { returnType, args };
    }
  }
};

export default {
  getResolvers,
  getGraphqlSchemas
};
