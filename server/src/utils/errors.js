class AppError extends Error {
  constructor(statusCode = 500, message) {
    super(message)
    this.status = statusCode
    this.statusText = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

const getAppError = (statusCode, msg) => new AppError(statusCode, msg)

module.exports = {
  AppError,
  getAppError,
}
