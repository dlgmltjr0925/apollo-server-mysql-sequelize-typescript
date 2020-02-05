import configs, { ENV, LOG_LEVEL } from '../configs';

import { LOG_LABEL } from '../constants';

type LogFunction = (...optionalPrams: any[]) => void;

const setDebug = (): LogFunction => {
  if (configs.log.level <= LOG_LEVEL.DEBUG) {
    if (configs.env === ENV.DEV) {
      return (...optionalPrams) => {
        console.debug(LOG_LABEL.COLORED_DEBUG, ...optionalPrams);
      };
    } else {
      return (...optionalPrams) => {
        console.debug(LOG_LABEL.DEBUG, ...optionalPrams);
      };
    }
  } else {
    return () => {};
  }
};

const setInfo = (): LogFunction => {
  if (configs.log.level <= LOG_LEVEL.INFO) {
    if (configs.env === ENV.DEV) {
      return (...optionalPrams) => {
        console.log(LOG_LABEL.COLORED_INFO, ...optionalPrams);
      };
    } else {
      return (...optionalPrams) => {
        console.log(LOG_LABEL.INFO, ...optionalPrams);
      };
    }
  } else {
    return () => {};
  }
};

const setWarn = (): LogFunction => {
  if (configs.log.level <= LOG_LEVEL.WARN) {
    if (configs.env === ENV.DEV) {
      return (...optionalPrams) => {
        console.warn(LOG_LABEL.COLORED_WARN, ...optionalPrams);
        console.trace();
      };
    } else {
      return (...optionalPrams) => {
        console.warn(LOG_LABEL.WARN, ...optionalPrams);
      };
    }
  } else {
    return () => {};
  }
};

const setError = (): LogFunction => {
  if (configs.log.level <= LOG_LEVEL.ERROR) {
    if (configs.env === ENV.DEV) {
      return (...optionalPrams) => {
        console.error(LOG_LABEL.COLORED_ERROR, ...optionalPrams);
        console.trace();
      };
    } else {
      return (...optionalPrams) => {
        console.error(LOG_LABEL.ERROR, ...optionalPrams);
        console.trace();
      };
    }
  } else {
    return () => {};
  }
};

const setFatal = (): LogFunction => {
  if (configs.env === ENV.DEV) {
    return (...optionalPrams) => {
      console.error(LOG_LABEL.COLORED_FATAL, ...optionalPrams);
      console.trace();
    };
  } else {
    return (...optionalPrams) => {
      console.error(LOG_LABEL.FATAL, ...optionalPrams);
      console.trace();
    };
  }
};

export class Log {
  d = setDebug();
  i = setInfo();
  w = setWarn();
  e = setError();
  f = setFatal();
}

export default new Log();
