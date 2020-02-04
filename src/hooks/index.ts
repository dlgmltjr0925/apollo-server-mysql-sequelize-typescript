import { HOOKS_DIR } from '../constants/path';
import fs from 'fs';
import log from '../utils/log';

interface Hooks {
  [key: string]: any;
}

export const hooks: Hooks = {};
const dirList = fs.readdirSync(HOOKS_DIR);
dirList.forEach(dirName => {
  if (dirName === 'index.js') return;
  const fileList = fs.readdirSync(HOOKS_DIR + '/' + dirName);
  fileList.forEach(fileName => {
    hooks[
      fileName.slice(0, -3)
    ] = require(`${HOOKS_DIR}/${dirName}/${fileName}`).default;
  });
});

export default hooks;
