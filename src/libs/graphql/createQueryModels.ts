import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createQueryModels = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name);
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const query = `const ${camelCasedName} = {
  parent: 'Query',
  filedName: '${camelCasedName}s',
  returnType: '[${pascalCasedName}]',
  args: {
    where: '${pascalCasedName}Input',
    order: '[[String]]', // [['title', 'DESC'], ['id', 'ASC']]
    limit: 'Int',
    offset: 'Int',
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.findAll(args);
  }
};

export default ${camelCasedName}`;
  fs.writeFileSync(APP_RESOLVERS_DATABASES_DIR + `/Query/${name}s.ts`, query);
};

export default createQueryModels;
