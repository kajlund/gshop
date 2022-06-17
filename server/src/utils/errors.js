const { StatusCodes, ReasonPhrases } = require('http-status-codes')

class AppError extends Error {
  constructor(statusCode = 500, message, isOperational = true, stack = '') {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.statusText = `${statusCode}`.startsWith('4') ? 'failure' : 'error'
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

exports.getAppError = (statusCode, msg, isOperational = true, stack = '') =>
  new AppError(statusCode, msg, isOperational, stack)
exports.getInternalServerError = (desc) =>
  new AppError(StatusCodes.INTERNAL_SERVER_ERROR, desc || ReasonPhrases.INTERNAL_SERVER_ERROR)
exports.getNotFoundError = (desc) => new AppError(StatusCodes.NOT_FOUND, desc || ReasonPhrases.NOT_FOUND)
exports.getUnauthorizedError = (desc) => new AppError(StatusCodes.UNAUTHORIZED, desc || ReasonPhrases.UNAUTHORIZED)
exports.getUnprocessableError = (desc) =>
  new AppError(StatusCodes.UNPROCESSABLE_ENTITY, desc || ReasonPhrases.UNPROCESSABLE_ENTITY)
