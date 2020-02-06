import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createQueryModels = async (
  { endPoint, endPointPrefix, database, databasePrefix, tableName }: ModelArg,
  beforeHook?: boolean,
  afterHook?: boolean
) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name);
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const query = `import log from '../../../utils/log';

const ${camelCasedName} = {
  parent: 'Query',
  fieldName: '${camelCasedName}s',
  returnType: '[${pascalCasedName}]',
  args: {
    where: '${pascalCasedName}Input',
    order: '[[String]]', // [['title', 'DESC'], ['id', 'ASC']]
    limit: 'Int',
    offset: 'Int',
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.findAll(args);
  },
  ${beforeHook &&
    `beforeHook: async (parent: any, args: any, context: any, info: any) => {
    log.d('[before${pascalCasedName}s]');
  },`}
  ${afterHook &&
    `afterHook: async (parent: any, args: any, context: any, info: any) => {
    log.d('[after${pascalCasedName}s]');
  },`}
};

export default ${camelCasedName}`;
  fs.writeFileSync(APP_RESOLVERS_DATABASES_DIR + `/Query/${name}s.ts`, query);
};

export default createQueryModels;
