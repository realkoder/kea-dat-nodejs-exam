import pino from 'pino';

const logger = pino();

function prefixedLogger(prependMessage) {
  return {
    info: message => logger.info(`${prependMessage} ${message}`),
    error: message => logger.error(`${prependMessage} ${message}`),
    debug: message => logger.debug(`${prependMessage} ${message}`),
  };
}

export default prefixedLogger;
