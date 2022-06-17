const { StatusCodes } = require('http-status-codes')

const svcUser = require('./user.service')

exports.profile = async (req, res, next) => {
  try {
    const profileData = await svcUser.getUserProfile(req.auth.id)
    res.status(StatusCodes.OK).json(profileData)
  } catch (error) {
    next(error)
  }
}
