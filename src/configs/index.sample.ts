import { Options } from 'sequelize/types';

export enum ENV {
  DEV = 'DEV',
  QA = 'QA',
  PROD = 'PROD'
}

export enum LOG_LEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}

export enum INFO {
  DATE,
  DATETIME
}

export enum PERIOD {
  ALWAYS,
  AFTER_DB_UPDATE
}
export interface GenerateOptions {
  period: PERIOD;
  resolvers: {
    beforeHookQuerySingle: boolean;
    querySingle: boolean;
    afterHookQuerySingle: boolean;
    beforeHookQueryMulti: boolean;
    queryMulti: boolean;
    afterHookQueryMulti: boolean;
    beforeHookMutationCreate: boolean;
    mutationCreate: boolean;
    afterHookMutationCreate: boolean;
    pubsubMutationCreate: boolean;
    beforeHookMutationUpdate: boolean;
    mutationUpdate: boolean;
    afterHookMutationUpdate: boolean;
    pubsubMutationUpdate: boolean;
    beforeHookMutationDelete: boolean;
    mutationDelete: boolean;
    afterHookMutationDelete: boolean;
    pubsubMutationDelete: boolean;
    subscribe: boolean;
  };
}

export interface AccessInfo {
  database: string;
  user: string;
  password: string;
  alias: string;
  generateOptions?: Partial<GenerateOptions>;
}

export interface Database {
  hostname: string;
  options: Options;
  accessInfos: AccessInfo[];
}

export interface Messages {
  [key: string]: { code: number; message: string };
}

export interface Configs {
  env: ENV;
  host: string;
  port: number;
  log: {
    level: LOG_LEVEL;
  };
  cluster: {
    count: number;
  };
  defaultGenerateOptions: GenerateOptions;
  databases: Database[];
  messages: Messages;
}

export const configs: Configs = {
  env: ENV.DEV, // <-- Edit the operating environment.
  host: 'localhost',
  port: 4000,
  log: {
    level: LOG_LEVEL.DEBUG
  },
  cluster: {
    count: 1 // <-- Edit number of worker, minimum 1
  },
  defaultGenerateOptions: {
    period: PERIOD.ALWAYS,
    resolvers: {
      beforeHookQuerySingle: true,
      querySingle: true,
      afterHookQuerySingle: true,
      beforeHookQueryMulti: true,
      queryMulti: true,
      afterHookQueryMulti: true,
      beforeHookMutationCreate: true,
      mutationCreate: true,
      afterHookMutationCreate: true,
      pubsubMutationCreate: true,
      beforeHookMutationUpdate: true,
      mutationUpdate: true,
      afterHookMutationUpdate: true,
      pubsubMutationUpdate: true,
      beforeHookMutationDelete: true,
      mutationDelete: true,
      afterHookMutationDelete: true,
      pubsubMutationDelete: true,
      subscribe: true
    }
  },
  databases: [
    {
      hostname: 'hostname1',
      options: {
        dialect: 'mysql',
        host: 'host', // <-- Edit host of Database server
        port: 3306, // <-- Edit port of Database server
        // Edit additional options. ref : https://sequelize.org/v5/class/lib/sequelize.js~Sequelize.html#instance-method-define
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
          acquire: 60000,
          evict: 1000
        },
        define: {
          underscored: true,
          freezeTableName: true,
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
          timestamps: false
        }
      },
      accessInfos: [
        {
          database: 'information_schema',
          user: 'user', // <-- Edit the DDL account information for that database.
          password: 'password', // <-- Edit the DDL account information for that database.
          alias: 'information_schema'
        },
        {
          database: 'database', // <-- Enter the name of the database you will use.
          user: 'user', // <-- Edit the DML account information for that database.
          password: 'password', // <-- Edit the DML account information for that database.
          alias: 'database1', // <-- Identifier to database(unique)
          generateOptions: {
            period: PERIOD.ALWAYS,
            resolvers: {
              beforeHookQuerySingle: true,
              querySingle: true,
              afterHookQuerySingle: true,
              beforeHookQueryMulti: true,
              queryMulti: true,
              afterHookQueryMulti: true,
              beforeHookMutationCreate: true,
              mutationCreate: true,
              afterHookMutationCreate: true,
              pubsubMutationCreate: true,
              beforeHookMutationUpdate: true,
              mutationUpdate: true,
              afterHookMutationUpdate: true,
              pubsubMutationUpdate: true,
              beforeHookMutationDelete: true,
              mutationDelete: true,
              afterHookMutationDelete: true,
              pubsubMutationDelete: true,
              subscribe: true
            }
          }
        }
        // Add additional databases if you have them.
        // {
        //   database: 'database_name',
        //   user: 'user',
        //   password: 'password'
        // }
      ]
    }
  ],
  messages: {
    exitAfterUpdate: {
      code: -200,
      message: 'The process ends after the update.'
    }
  }
};

export default configs;
