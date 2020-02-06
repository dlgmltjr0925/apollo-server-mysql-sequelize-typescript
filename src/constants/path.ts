export const APP_ROOT = process.cwd();
export const BUILD_ROOT = APP_ROOT + '/dist';

export const CONFIGS_DIR = BUILD_ROOT + '/configs';

export const CONSTANTS_DIR = BUILD_ROOT + '/constants';

export const LIBS_DIR = BUILD_ROOT + '/libs';
export const DB_CHECK_DIR = BUILD_ROOT + '/libs/sequelize/check';

export const RESOLVERS_DIR = BUILD_ROOT + '/resolvers';
export const RESOLVERS_DATABASES_DIR = RESOLVERS_DIR + '/databases';
export const RESOLVERS_EXTENDS_DIR = RESOLVERS_DIR + '/extends';

export const APP_RESOLVERS_DIR = APP_ROOT + '/src/resolvers';
export const APP_RESOLVERS_DATABASES_DIR = APP_RESOLVERS_DIR + '/databases';
export const APP_RESOLVERS_EXTENDS_DIR = APP_RESOLVERS_DIR + '/extends';

export const SCHEMAS_DIR = BUILD_ROOT + '/schemas';
export const SCHEMAS_EXTENDS_DIR = SCHEMAS_DIR + '/extends';

export const APP_SCHEMAS_DIR = APP_ROOT + '/src/schemas';
export const APP_SCHEMAS_EXTENDS_DIR = APP_SCHEMAS_DIR + '/extends';

export const UTILS_DIR = BUILD_ROOT + '/utils';

export default {
  APP_ROOT,
  BUILD_ROOT,

  CONFIGS_DIR,

  CONSTANTS_DIR,

  LIBS_DIR,
  DB_CHECK_DIR,

  RESOLVERS_DIR,
  RESOLVERS_DATABASES_DIR,
  RESOLVERS_EXTENDS_DIR,

  APP_RESOLVERS_DIR,
  APP_RESOLVERS_DATABASES_DIR,
  APP_RESOLVERS_EXTENDS_DIR,

  SCHEMAS_DIR,
  SCHEMAS_EXTENDS_DIR,

  APP_SCHEMAS_DIR,
  APP_SCHEMAS_EXTENDS_DIR,

  UTILS_DIR
};
