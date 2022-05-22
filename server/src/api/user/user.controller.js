const { StatusCodes } = require('http-status-codes')

const { getAppError } = require('../../utils/errors')
const { getUserProfile } = require('./user.service')

const Profile = async (req, res, next) => {
  const profileData = await getUserProfile(req.auth.id)
  if (!profileData) {
    return next(getAppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials'))
  }
  res.status(StatusCodes.OK).json(profileData)
}

module.exports = {
  Profile,
}
