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
    query: {
      single: boolean;
      multi: boolean;
    };
    mutation: {
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    subscribe: boolean;
  };
}

export interface AccessInfo {
  alias?: string;
  database: string;
  user: string;
  password: string;
  generateOptions?: Partial<GenerateOptions>;
}

export interface Database {
  alias?: string;
  options: Options;
  accessInfos: AccessInfo[];
}

export interface Messages {
  [key: string]: { code: number; message: string };
}

export interface Configs {
  env: ENV;
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

const configs: Configs = {
  env: ENV.DEV, // <-- Edit the operating environment.
  log: {
    level: LOG_LEVEL.DEBUG
  },
  cluster: {
    count: 1 // <-- Edit number of worker, minimum 1
  },
  defaultGenerateOptions: {
    period: PERIOD.ALWAYS,
    resolvers: {
      query: {
        single: true,
        multi: true
      },
      mutation: {
        create: true,
        update: true,
        delete: true
      },
      subscribe: true
    }
  },
  databases: [
    {
      alias: 'endpoint1', // <-- Identifier to host(optional, unique). if not input value, 'host:port'
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
          password: 'password' // <-- Edit the DDL account information for that database.
        },
        {
          database: 'database_name', // <-- Enter the name of the database you will use.
          user: 'user', // <-- Edit the DML account information for that database.
          password: 'password', // <-- Edit the DML account information for that database.
          alias: '', // <-- Identifier to database(optional, unique). if not input value, 'database value'
          generateOptions: {
            period: PERIOD.ALWAYS,
            resolvers: {
              query: {
                single: true,
                multi: true
              },
              mutation: {
                create: true,
                update: true,
                delete: true
              },
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
