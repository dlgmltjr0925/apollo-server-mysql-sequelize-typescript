const pid = process.pid;

const LOG_LABEL = {
  DEBUG: `[${pid}][DEBUG]`,
  INFO: `[${pid}][INFO]`,
  WARN: `[${pid}][WARN]`,
  ERROR: `[${pid}][ERROR]`,
  FATAL: `[${pid}][FATAL]`,
  COLORED_DEBUG: `\u001b[42m\u001b[30m[${pid}][DEBUG]\u001b[39m\u001b[49m`,
  COLORED_INFO: `\u001b[47m\u001b[30m[${pid}][INFO ]\u001b[39m\u001b[49m`,
  COLORED_WARN: `\u001b[43m\u001b[30m[${pid}][WARN ]\u001b[39m\u001b[49m`,
  COLORED_ERROR: `\u001b[41m\u001b[37m[${pid}][ERROR]\u001b[39m\u001b[49m`,
  COLORED_FATAL: `\u001b[44m\u001b[37m[${pid}][FATAL]\u001b[39m\u001b[49m`
};

export default LOG_LABEL;
