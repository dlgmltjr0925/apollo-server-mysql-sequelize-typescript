import fs from 'fs';
import log from '../../utils/log';

interface Hooks {
  [key: string]: any;
}

export const hooks: Hooks = {};
const hookList = fs.readdirSync(__dirname);

hookList.forEach(name => {
  if (name.slice(-3) === '.js' && name !== 'index.js')
    hooks[name.slice(0, -3)] = require(`./${name}`);
});

export default hooks;
