const { StatusCodes } = require('http-status-codes')
const svcAuth = require('./auth.service')

exports.logon = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await svcAuth.logonUser(req.body)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    })
    res.status(StatusCodes.OK).json({ success: true, data: { token: accessToken } })
  } catch (error) {
    next(error)
  }
}

exports.logoff = async (req, res, next) => {
  const token = req.cookies['refresh_token']
  try {
    await svcAuth.logoffUser(token)
    // Remove cookie
    res.cookie('refresh_token', '', { maxAge: 0 })
    res.status(StatusCodes.OK).json({ success: true, message: 'Logged off' })
  } catch (error) {
    next(error)
  }
}

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const token = await svcAuth.refreshAccessToken(req.cookies['refresh_token'])
    res.status(StatusCodes.OK).json({ success: true, data: { token } })
  } catch (error) {
    next(error)
  }
}

exports.signupUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await svcAuth.signupUser(req.body)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    })
    res.status(StatusCodes.OK).json({ success: true, data: { token: accessToken } })
  } catch (error) {
    next(error)
  }
}
