import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createQueryModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name);
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const query = `export const ${camelCasedName} = {
  parent: 'Query',
  filedName: '${camelCasedName}',
  returnType: '${pascalCasedName}',
  args: {
    where: '${pascalCasedName}Input',
  },
  resolve: async (parent: any, { where }: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.findOne({ where }); 
  }
};

export default ${camelCasedName}`;

  fs.writeFileSync(`${APP_RESOLVERS_DATABASES_DIR}/Query/${name}.ts`, query);
};

export default createQueryModel;
