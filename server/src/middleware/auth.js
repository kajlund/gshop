const { getUserById } = require('../api/user/user.service')
const { getUnauthorizedError } = require('../utils/errors')
const { verifyAccessToken } = require('../utils/auth')
const cnf = require('../config')

const protect = async (req, res, next) => {
  const error = getUnauthorizedError()
  const access_token = req.header('Authorization')?.split(' ')[1] || ''

  try {
    const payload = verifyAccessToken(access_token, cnf.jwtAccessTokenSecret)
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
    return next(error)
  }
}

module.exports = {
  protect,
}
