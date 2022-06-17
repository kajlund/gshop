const pino = require('pino')

let logger

module.exports = (cnf = {}) => {
  if (!logger) {
    logger = pino(cnf)
    logger.info(cnf, 'Logger configured: ')
  }

  return {
    info: (msg = '', obj = null) => logger.info(obj, msg),
    warn: (msg = '', obj = null) => logger.warn(obj, msg),
    error: (msg = '', obj = null) => logger.error(obj, msg),
    fatal: (msg = '', obj = null) => logger.fatal(obj, msg),
  }
}
