import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createMutationUpdateModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `const update${pascalCasedName} = {
  parent: 'Mutation',
  filedName: 'update${pascalCasedName}',
  returnType: 'Int',
  args: {
    input: '${pascalCasedName}Input!',
    where: '${pascalCasedName}Input',
  },
  resolve: async (parent: any, { input, where }: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.update(input, { where });
  }
};

export default update${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR + `/Mutation/update${pascalCasedName}.ts`,
    mutation
  );
};

export default createMutationUpdateModel;
