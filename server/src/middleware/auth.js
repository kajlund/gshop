const log = require('../utils/log')
const { verify } = require('jsonwebtoken')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')

const { getUserById } = require('../api/user/user.service')
const { getAppError } = require('../utils/errors')

const protect = async (req, res, next) => {
  const error = getAppError(StatusCodes.UNAUTHORIZED, getReasonPhrase(StatusCodes.UNAUTHORIZED))
  const access_token = req.header('Authorization')?.split(' ')[1] || ''

  try {
    const payload = verify(access_token, process.env.ACCESS_SECRET)
    if (!payload) {
      return next(error)
    }
    const user = await getUserById(payload.id)
    if (!user) {
      return next(error)
    }
    req.auth = user
    next()
  } catch (err) {
    log.error(err)
    return next(error)
  }
}

module.exports = {
  protect,
}
