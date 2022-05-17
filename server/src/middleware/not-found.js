const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getAppError } = require('../utils/errors')

const notFound = (req, res, next) => next(getAppError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND))

module.exports = notFound
