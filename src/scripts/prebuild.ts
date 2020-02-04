import { createResolversFromStore } from '../libs/graphql';
import { createStores } from '../libs/sequelize';

(async () => {
  const stores = await createStores();

  await createResolversFromStore(stores);

  process.exit();
})();
