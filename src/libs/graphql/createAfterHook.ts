import { APP_HOOKS_DATABASES_DIR } from '../../constants/path';
import { ModelArg } from '.';
import camelCase from 'camelcase';
import fs from 'fs';
import log from '../../utils/log';

export const createAfterHook = async ({
  prefix,
  subfix,
  endPointPrefix,
  databasePrefix,
  tableName
}: ModelArg) => {
  const name =
    (prefix ? prefix + '_' : '') +
    endPointPrefix +
    databasePrefix +
    tableName +
    (subfix ? subfix : '');
  const hookName = 'after' + camelCase(name, { pascalCase: true });

  const hook = `import log from '../../utils/log';

export const ${hookName} = async (parent: any, args: any, context: any, info: any) => {
  log.d('[${hookName}]');
};

export default ${hookName}`;

  fs.writeFileSync(`${APP_HOOKS_DATABASES_DIR}/${hookName}.ts`, hook);
};

export default createAfterHook;
