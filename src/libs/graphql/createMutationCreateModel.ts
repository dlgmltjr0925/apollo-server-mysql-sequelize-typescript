import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createMutationCreateModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `const create${pascalCasedName} = {
  parent: 'Mutation',
  filedName: 'create${pascalCasedName}',
  returnType: '${pascalCasedName}',
  args: {
    input: '${pascalCasedName}Input!',
  },
  resolve: async (parent: any, { input }: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.create(input);
  }
};

export default create${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR + `/Mutation/create${pascalCasedName}.ts`,
    mutation
  );
};

export default createMutationCreateModel;
