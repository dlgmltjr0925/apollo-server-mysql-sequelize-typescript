import { APP_RESOLVERS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';

export const createSubscriptionModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `import { pubsub } from '../../../libs/apollo/pubsub';

const subscribe${pascalCasedName} = {
  parent: 'Subscription',
  fieldName: 'subscribe${pascalCasedName}',
  returnType: '${pascalCasedName}',
  args: {},
  resolve: {
    subscribe: () => pubsub.asyncIterator(['${pascalCasedName.toUpperCase()}']),
  }
};

export default subscribe${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR +
      `/Subscription/subscribe${pascalCasedName}.ts`,
    mutation
  );
};

export default createSubscriptionModel;
