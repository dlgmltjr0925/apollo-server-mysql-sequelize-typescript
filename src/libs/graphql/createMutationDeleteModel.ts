import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createMutationDeleteModel = async (
  { endPoint, endPointPrefix, database, databasePrefix, tableName }: ModelArg,
  beforeHook?: boolean,
  afterHook?: boolean
) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `import log from '../../../utils/log';

const delete${pascalCasedName} = {
  parent: 'Mutation',
  fieldName: 'delete${pascalCasedName}',
  returnType: 'Int',
  args: {
    where: '${pascalCasedName}Input',
  },
  resolve: async (parent: any, { where }: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.destroy({ where });
  },
  ${beforeHook &&
    `beforeHook: async (parent: any, args: any, context: any, info: any) => {
    log.d('[before${pascalCasedName}]');
  },`}
  ${afterHook &&
    `afterHook: async (parent: any, args: any, context: any, info: any) => {
    log.d('[after${pascalCasedName}]');
  },`}
};

export default delete${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR + `/Mutation/delete${pascalCasedName}.ts`,
    mutation
  );
};

export default createMutationDeleteModel;
