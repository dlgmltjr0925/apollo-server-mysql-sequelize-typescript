const pid = process.pid;

const LOG_LABEL = {
  DEBUG: `[${pid}][DEBUG]`,
  INFO: `[${pid}][INFO]`,
  WARN: `[${pid}][WARN]`,
  ERROR: `[${pid}][ERROR]`,
  FATAL: `[${pid}][FATAL]`,
  COLORED_DEBUG: `[${pid}]\u001b[42m\u001b[30m[DEBUG]\u001b[39m\u001b[49m`,
  COLORED_INFO: `[${pid}]\u001b[47m\u001b[30m[INFO ]\u001b[39m\u001b[49m`,
  COLORED_WARN: `[${pid}]\u001b[43m\u001b[30m[WARN ]\u001b[39m\u001b[49m`,
  COLORED_ERROR: `[${pid}]\u001b[41m\u001b[37m[ERROR]\u001b[39m\u001b[49m`,
  COLORED_FATAL: `[${pid}]\u001b[44m\u001b[37m[FATAL]\u001b[39m\u001b[49m`
};

export default LOG_LABEL;
