import * as fs from 'fs';

import {
  BIGINT,
  BLOB,
  BOOLEAN,
  DATE,
  DATEONLY,
  DECIMAL,
  DOUBLE,
  ENUM,
  FLOAT,
  GEOMETRY,
  INTEGER,
  SMALLINT,
  STRING,
  Sequelize,
  TEXT,
  TINYINT
} from 'sequelize';
import configs, { AccessInfo, GenerateOptions } from '../../configs';

import { DB_CHECK_DIR } from '../../constants/path';
import { Options } from 'sequelize';
import camelCase from 'camelcase';
import { cloneDeep } from 'lodash';
import log from '../../utils/log';

interface Database {
  [key: string]: any;
  getSchemas?: () => any;
  getGenerateOptions?: () => GenerateOptions;
}

/**
 * Example
 * Store: {
 *   endpoint1: {
 *     databaseName: {
 *       ...models, // sequelize's models
 *       getSchemas: [Function]
 *     }
 *   }
 * }
 */
export interface Stores {
  [key: string]: Database;
}

const getSequelizeTypeFromDBType = (dbType: string) => {
  let value: string[] = [''];
  let type = dbType;
  if (dbType.split(' ')[0].slice(-1) === ')') {
    type = dbType.split('(')[0];
    value = dbType
      .slice(0, -1)
      .split('(')[1]
      .split(',');
  }
  switch (type) {
    case 'char':
      return STRING(parseInt(value[0], 10));
    case 'varchar':
      return STRING(parseInt(value[0], 10));
    case 'text':
      return TEXT;
    case 'tinytext':
      return TEXT({ length: 'tiny' });
    case 'int':
      return INTEGER;
    case 'smallint':
      return SMALLINT({ length: parseInt(value[0], 10) });
    case 'bigint':
      return BIGINT({ length: parseInt(value[0], 10) });
    case 'float':
      return FLOAT;
    case 'double':
      return DOUBLE;
    case 'decimal':
      return DECIMAL(parseInt(value[0], 10), parseInt(value[1], 10));
    case 'date':
      return DATEONLY;
    case 'datetime':
      return value.length > 0 ? DATE(parseInt(value[0])) : DATE;
    case 'tinyint':
      return value[0].length > 1
        ? TINYINT({ length: parseInt(value[0], 10) })
        : BOOLEAN;
    case 'enum':
      return ENUM(...value);
    case 'blob':
      return BLOB;
    case 'longblob':
      return BLOB('long');
    case 'mediumblob':
      return BLOB('medium');
    case 'tinyblob':
      return BLOB('tiny');
    case 'geometry':
      return GEOMETRY;
    case 'point':
      return GEOMETRY('point');
  }
};

const getScalarTypeFromDBType = (dbType: string): string => {
  const type = dbType.split('(')[0];
  switch (type) {
    case 'char':
    case 'varchar':
    case 'text':
    case 'tinytext':
      return 'String';
    case 'int':
    case 'smallint':
    case 'bigint':
      return 'Int';
    case 'float':
    case 'double':
    case 'decimal':
      return 'Float';
    case 'date':
    case 'datetime':
      return 'Date';
    case 'tinyint':
      return 'Boolean';
    case 'enum':
      return 'enum';
    default:
      return 'String';
  }
};

const createModels = async (
  columns: any,
  { database, user, password }: AccessInfo,
  options: Options
) => {
  const sequelize = new Sequelize(database, user, password, options);

  // define models
  const schemas: any = {};
  const tableNameTable: any = {};
  columns.forEach(
    ({
      tableName,
      ordinalPosition,
      columnName,
      columnType,
      columnKey,
      isNullable,
      columnDefault,
      extra
    }: any) => {
      const camelCasedTableName = camelCase(tableName);
      const camelCasedColumnName = camelCase(columnName);
      if (ordinalPosition === 1) {
        schemas[camelCasedTableName] = {};
        tableNameTable[camelCasedTableName] = tableName;
      }
      schemas[camelCasedTableName][camelCasedColumnName] = {
        field: columnName,
        type: getSequelizeTypeFromDBType(columnType),
        scalarType: getScalarTypeFromDBType(columnType),
        allowNull: isNullable === 'YES'
      };
      if (columnKey === 'PRI')
        schemas[camelCasedTableName][camelCasedColumnName].primaryKey = true;
      if (extra === 'auto_increment')
        schemas[camelCasedTableName][camelCasedColumnName].autoIncrement = true;
      if (columnDefault)
        schemas[camelCasedTableName][
          camelCasedColumnName
        ].defaultValue = Sequelize.literal(`${columnDefault}`.trim());
    }
  );

  // define sequelize type
  await Promise.all(
    Object.keys(schemas).map(async modelName => {
      try {
        await sequelize.define(modelName, schemas[modelName], {
          tableName: tableNameTable[modelName]
        });
      } catch (error) {
        log.e(error);
      }
    })
  );

  return { schemas, models: sequelize.models };
};

export const createStores = async (): Promise<Stores> => {
  const stores: Stores = {};
  await Promise.all(
    configs.databases.map(async ({ alias, options, accessInfos }) => {
      const { host, port } = options;
      const endPoint: string = alias || `${host}:${port}`;
      stores[endPoint] = {};
      const { database, user, password } = accessInfos[0];
      const sequelize = new Sequelize(database, user, password, options);
      await Promise.all(
        accessInfos.slice(1).map(async accessInfo => {
          const { alias, database } = accessInfo;
          const databaseName = alias || camelCase(database);
          const [columns] = await sequelize.query(`
            SELECT
              table_name as 'tableName', 
              ordinal_position as 'ordinalPosition', 
              column_name as 'columnName', 
              column_type as 'columnType',
              column_key as 'columnKey', 
              is_nullable as 'isNullable',
              column_default as 'columnDefault', 
              extra as 'extra'
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA='${database}'
            ORDER BY tableName, ordinalPosition`);
          const { models, schemas } = await createModels(
            columns,
            accessInfo,
            options
          );

          const generateOptions: GenerateOptions = cloneDeep(
            configs.defaultGenerateOptions
          );
          if (accessInfo.generateOptions) {
            const { period } = accessInfo.generateOptions;
            if (period !== undefined) generateOptions.period = period;
            if (
              accessInfo.generateOptions &&
              accessInfo.generateOptions.resolvers
            ) {
              generateOptions.resolvers = {
                ...generateOptions.resolvers,
                ...accessInfo.generateOptions.resolvers
              };
            }
          }
          stores[endPoint][databaseName] = models;
          stores[endPoint][databaseName].getSchemas = () => schemas;
          stores[endPoint][databaseName].getGenerateOptions = () =>
            generateOptions;
        })
      );
    })
  );
  return stores;
};

export const checkUpdateState = async (): Promise<boolean> => {
  let updateState = true;
  await Promise.all(
    configs.databases.map(async ({ options, accessInfos }) => {
      const { database, user, password } = accessInfos[0];
      const sequelize = new Sequelize(database, user, password, options);
      const databases = accessInfos.slice(1).map(({ database }) => database);
      const tableSchemas = databases
        .map(database => `TABLE_SCHEMA = '${database}'`)
        .join(' OR ');
      const [tableUpdates]: any[] = await sequelize.query(`
        SELECT
          MAX(UPDATE_TIME) as updateTime,
          MAX(CREATE_TIME) as createTime
        FROM TABLES
        WHERE ${tableSchemas}`);
      const { updateTime, createTime } = tableUpdates[0];
      const latestUpdateTime = Math.max(
        new Date(updateTime).valueOf(),
        new Date(createTime).valueOf()
      );
      const updateFilePath = DB_CHECK_DIR + '/' + options.host;
      try {
        if (!fs.existsSync(DB_CHECK_DIR)) {
          await fs.mkdirSync(DB_CHECK_DIR);
        }
        if (fs.existsSync(updateFilePath)) {
          const updateFileData = fs.readFileSync(updateFilePath, {
            encoding: 'utf8'
          });
          if (latestUpdateTime > parseInt(updateFileData, 10)) {
            fs.writeFileSync(updateFilePath, latestUpdateTime, {
              encoding: 'utf8'
            });
          } else {
            updateState = false;
          }
        } else {
          fs.writeFileSync(updateFilePath, latestUpdateTime, {
            encoding: 'utf8'
          });
        }
      } catch (error) {
        log.e(error);
      }
    })
  );
  return updateState;
};

export default {
  createStores,
  checkUpdateState
};
