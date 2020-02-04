import {
  APP_HOOKS_DATABASES_DIR,
  APP_HOOKS_DIR,
  APP_RESOLVERS_DATABASES_DIR,
  APP_RESOLVERS_DIR,
  SCHEMAS_DIR,
  SCHEMAS_EXTENDS_DIR
} from '../../constants/path';

import { Stores } from '../../libs/sequelize';
import camelCase from 'camelcase';
import configs from '../../configs';
import createAfterHook from './createAfterHook';
import createBeforeHook from './createBeforeHook';
import createMutationCreateModel from './createMutationCreateModel';
import createMutationDeleteModel from './createMutationDeleteModel';
import createMutationUpdateModel from './createMutationUpdateModel';
import createQueryModel from './createQueryModel';
import createQueryModels from './createQueryModels';
import createSubscriptionModel from './createSubscriptionModel';
import fs from 'fs';
import log from '../../utils/log';

export interface ModelArg {
  prefix?: string;
  subfix?: string;
  endPoint: string;
  endPointPrefix: string;
  database: string;
  databasePrefix: string;
  tableName: string;
}

export const createResolversFromStore = async (
  stores: Stores
): Promise<void> => {
  if (!fs.existsSync(APP_RESOLVERS_DIR)) fs.mkdirSync(APP_RESOLVERS_DIR);
  if (!fs.existsSync(APP_RESOLVERS_DATABASES_DIR))
    fs.mkdirSync(APP_RESOLVERS_DATABASES_DIR);
  if (!fs.existsSync(APP_RESOLVERS_DATABASES_DIR + '/Query'))
    fs.mkdirSync(APP_RESOLVERS_DATABASES_DIR + '/Query');
  if (!fs.existsSync(APP_RESOLVERS_DATABASES_DIR + '/Mutation'))
    fs.mkdirSync(APP_RESOLVERS_DATABASES_DIR + '/Mutation');
  if (!fs.existsSync(APP_RESOLVERS_DATABASES_DIR + '/Subscription'))
    fs.mkdirSync(APP_RESOLVERS_DATABASES_DIR + '/Subscription');

  if (!fs.existsSync(APP_HOOKS_DIR)) fs.mkdirSync(APP_HOOKS_DIR);
  if (!fs.existsSync(APP_HOOKS_DATABASES_DIR))
    fs.mkdirSync(APP_HOOKS_DATABASES_DIR);

  const endPoints = Object.keys(stores);
  const endPointCount = endPoints.length;
  await Promise.all(
    endPoints.map(
      async (endPoint: string): Promise<void> => {
        const endPointPrefix = endPointCount === 1 ? '' : endPoint + '_';
        const databases = Object.keys(stores[endPoint]);
        const databaseCount = databases.length;
        await Promise.all(
          databases.map(
            async (database: string): Promise<void> => {
              const databasePrefix = databaseCount === 1 ? '' : database + '_';
              const schemas = stores[endPoint][database].getSchemas();
              const generateOptions = stores[endPoint][
                database
              ].getGenerateOptions();
              const tableNames = Object.keys(schemas);
              const resolvers = {
                ...configs.defaultGenerateOptions.resolvers,
                ...generateOptions.resolvers
              };
              const {
                beforeHookQuerySingle,
                querySingle,
                afterHookQuerySingle,
                beforeHookQueryMulti,
                queryMulti,
                afterHookQueryMulti,
                beforeHookMutationCreate,
                mutationCreate,
                afterHookMutationCreate,
                pubsubMutationCreate,
                beforeHookMutationUpdate,
                mutationUpdate,
                afterHookMutationUpdate,
                pubsubMutationUpdate,
                beforeHookMutationDelete,
                mutationDelete,
                afterHookMutationDelete,
                pubsubMutationDelete,
                subscribe
              } = resolvers;
              await Promise.all(
                tableNames.map(async tableName => {
                  const args = {
                    endPoint,
                    endPointPrefix,
                    database,
                    databasePrefix,
                    tableName
                  };
                  if (beforeHookQuerySingle) await createBeforeHook(args);
                  if (querySingle) await createQueryModel(args);
                  if (afterHookQuerySingle) await createAfterHook(args);

                  if (beforeHookQueryMulti)
                    await createBeforeHook({ ...args, subfix: 's' });
                  if (queryMulti) await createQueryModels(args);
                  if (afterHookQueryMulti)
                    await createAfterHook({ ...args, subfix: 's' });

                  if (beforeHookMutationCreate)
                    await createBeforeHook({ ...args, prefix: 'create' });
                  if (mutationCreate) await createMutationCreateModel(args);
                  if (afterHookMutationCreate)
                    await createAfterHook({ ...args, prefix: 'create' });

                  if (beforeHookMutationUpdate)
                    await createBeforeHook({ ...args, prefix: 'update' });
                  if (mutationUpdate) await createMutationUpdateModel(args);
                  if (afterHookMutationUpdate)
                    await createAfterHook({ ...args, prefix: 'update' });

                  if (beforeHookMutationDelete)
                    await createBeforeHook({ ...args, prefix: 'delete' });
                  if (mutationDelete) await createMutationDeleteModel(args);
                  if (afterHookMutationDelete)
                    await createAfterHook({ ...args, prefix: 'delete' });

                  if (subscribe) await createSubscriptionModel(args);
                })
              );
            }
          )
        );
      }
    )
  );
};

export const createGraphqlSchemasFromStore = async (
  stores: Stores
): Promise<any> => {
  if (!fs.existsSync(SCHEMAS_DIR)) fs.mkdirSync(SCHEMAS_DIR);
  if (!fs.existsSync(SCHEMAS_EXTENDS_DIR)) fs.mkdirSync(SCHEMAS_EXTENDS_DIR);

  const graphqlSchemas: any = {};
  const endPoints = Object.keys(stores);
  const endPointCount = endPoints.length;
  await Promise.all(
    endPoints.map(
      async (endPoint: string): Promise<void> => {
        const endPointPrefix = endPointCount === 1 ? '' : endPoint + '_';
        const databases = Object.keys(stores[endPoint]);
        const databaseCount = databases.length;
        await Promise.all(
          databases.map(
            async (database: string): Promise<void> => {
              const databasePrefix = databaseCount === 1 ? '' : database + '_';
              const models = stores[endPoint][database].getSchemas();
              const fieldNames = Object.keys(models);
              await Promise.all(
                fieldNames.map(async fieldName => {
                  const name = endPointPrefix + databasePrefix + fieldName;
                  const pascalCasedName = camelCase(name, { pascalCase: true });
                  graphqlSchemas[pascalCasedName] = { schemaType: 'Object' };
                  graphqlSchemas[pascalCasedName + 'Input'] = {
                    schemaType: 'Object'
                  };
                  const subfield = graphqlSchemas[pascalCasedName];
                  const subfieldInput =
                    graphqlSchemas[pascalCasedName + 'Input'];
                  const subfieldNames = Object.keys(models[fieldName]);
                  subfieldNames.map(subfieldName => {
                    const type = models[fieldName][subfieldName].scalarType;
                    if (type === 'enum') {
                      // enum type 지정
                      const enumName = camelCase(`${name}_${subfieldName}`, {
                        pascalCase: true
                      });
                      if (!graphqlSchemas[enumName])
                        graphqlSchemas[enumName] = {
                          schemaType: 'Enum',
                          values: []
                        };
                      models[fieldName][subfieldName].values.map(
                        (value: string) => {
                          graphqlSchemas[enumName].values.push(
                            `${value.replace(/\'/g, '').toUpperCase()}`
                          );
                        }
                      );
                      subfield[subfieldName] = {
                        args: {},
                        returnType: `${enumName}${
                          models[fieldName][subfieldName].allowNull ? '' : '!'
                        }`
                      };
                      subfieldInput[subfieldName] = {
                        args: {},
                        returnType: enumName
                      };
                    } else {
                      subfield[subfieldName] = {
                        args: {},
                        returnType: `${type}${
                          models[fieldName][subfieldName].allowNull ? '' : '!'
                        }`
                      };
                      if (
                        subfieldName !== 'createdAt' &&
                        subfieldName !== 'updatedAt'
                      ) {
                        subfieldInput[subfieldName] = {
                          args: {},
                          returnType: type
                        };
                      }
                    }
                  });
                })
              );
            }
          )
        );
      }
    )
  );
  return graphqlSchemas;
};

export default {
  createResolversFromStore,
  createGraphqlSchemasFromStore
};
