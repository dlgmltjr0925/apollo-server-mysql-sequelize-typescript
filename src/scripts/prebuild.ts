import {
  createGraphqlSchemaFilesFromStore,
  createResolverFilesFromStore
} from '../libs/graphql';

import { createStores } from '../libs/sequelize';

(async () => {
  const stores = await createStores();

  await createResolverFilesFromStore(stores);
  await createGraphqlSchemaFilesFromStore(stores);

  process.exit();
})();
