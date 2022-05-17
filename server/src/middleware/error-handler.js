const log = require('../utils/log')

/**
 * Generic Error Handling middleware. Will be called from controllers using next(e)
 * or by throwing errors
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || err.status || 500,
    error: err.error || err.statusText || 'Server Error',
    message: err.message || 'Internal Server Error',
  }

  if (process.env.NODE_ENV === 'development') {
    error['stack'] = err.stack
  }
  if (error.status === 500) {
    log.error(err)
  }
  res.status(error.statusCode).json(error)
}

module.exports = errorHandlerMiddleware
