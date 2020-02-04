import * as fs from 'fs';

import {
  APP_RESOLVERS_DATABASES_DIR,
  APP_RESOLVERS_DIR,
  APP_RESOLVERS_EXTENDS_DIR,
  SCHEMAS_DIR,
  SCHEMAS_EXTENDS_DIR
} from '../constants/path';

import { Stores } from '../libs/sequelize';
import camelCase from 'camelcase';
import log from '../utils/log';

interface ModelArg {
  endPoint: string;
  endPointPrefix: string;
  database: string;
  databasePrefix: string;
  tableName: string;
}

const createQueryModel = async ({
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
  fs.writeFileSync(APP_RESOLVERS_DATABASES_DIR + `/Query/${name}.ts`, query);
};

const createQueryModels = async ({
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

const createMutationCreateModel = async ({
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

const createMutationUpdateModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name, { pascalCase: true });
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

const createMutationDeleteModel = async ({
  endPoint,
  endPointPrefix,
  database,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name, { pascalCase: true });
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `const delete${pascalCasedName} = {
  parent: 'Mutation',
  filedName: 'delete${pascalCasedName}',
  returnType: 'Int',
  args: {
    where: '${pascalCasedName}Input',
  },
  resolve: async (parent: any, { where }: any, context: any, info: any) => {
    return await context.stores.${endPoint}.${database}.${tableName}.destroy({ where });
  }
};

export default delete${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR + `/Mutation/delete${pascalCasedName}.ts`,
    mutation
  );
};

const createSubscriptionModel = async ({
  endPointPrefix,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name = endPointPrefix + databasePrefix + tableName;
  const camelCasedName = camelCase(name, { pascalCase: true });
  const pascalCasedName = camelCase(name, { pascalCase: true });

  const mutation = `import { pubsub } from '../../../libs/apollo';

const subscribe${pascalCasedName} = {
  parent: 'Subscription',
  filedName: 'subscribe${pascalCasedName}',
  returnType: '${pascalCasedName}',
  args: {},
  resolve: {
    subscribe: () => pubsub.asyncIterator(['${camelCasedName.toUpperCase()}']),
  }
};

export default subscribe${pascalCasedName};`;

  fs.writeFileSync(
    APP_RESOLVERS_DATABASES_DIR +
      `/Subscription/subscribe${pascalCasedName}.ts`,
    mutation
  );
};

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
  if (!fs.existsSync(APP_RESOLVERS_EXTENDS_DIR))
    fs.mkdirSync(APP_RESOLVERS_EXTENDS_DIR);
  if (!fs.existsSync(APP_RESOLVERS_EXTENDS_DIR + '/Query'))
    fs.mkdirSync(APP_RESOLVERS_EXTENDS_DIR + '/Query');
  if (!fs.existsSync(APP_RESOLVERS_EXTENDS_DIR + '/Mutation'))
    fs.mkdirSync(APP_RESOLVERS_EXTENDS_DIR + '/Mutation');
  if (!fs.existsSync(APP_RESOLVERS_EXTENDS_DIR + '/Subscription'))
    fs.mkdirSync(APP_RESOLVERS_EXTENDS_DIR + '/Subscription');

  // Remove existing file
  const dirList = fs.readdirSync(APP_RESOLVERS_DATABASES_DIR);
  for (let i = 0; i < dirList.length; i++) {
    const fileList = fs.readdirSync(
      APP_RESOLVERS_DATABASES_DIR + '/' + dirList[i]
    );
    for (let j = 0; j < fileList.length; j++) {
      if (fileList[j] === 'index.ts') continue;
      fs.unlinkSync(
        APP_RESOLVERS_DATABASES_DIR + '/' + dirList[i] + '/' + fileList[j]
      );
    }
  }

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
              const { resolvers } = stores[endPoint][
                database
              ].getGenerateOptions();
              const { query, mutation, subscribe } = resolvers;
              const tableNames = Object.keys(schemas);
              await Promise.all(
                tableNames.map(async tableName => {
                  const args = {
                    endPoint,
                    endPointPrefix,
                    database,
                    databasePrefix,
                    tableName
                  };
                  if (query && query.single) await createQueryModel(args);
                  if (query && query.multi) await createQueryModels(args);
                  if (mutation && mutation.create)
                    await createMutationCreateModel(args);
                  if (mutation && mutation.update)
                    await createMutationUpdateModel(args);
                  if (mutation && mutation.delete)
                    await createMutationDeleteModel(args);
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
