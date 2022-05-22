const { StatusCodes } = require('http-status-codes')
const { isEmail, isLength } = require('validator')

const { getAppError } = require('../../utils/errors')
const {
  getAccessToken,
  getRefreshToken,
  passwordsMatch,
  refreshAccessToken,
  removeRefreshToken,
} = require('../auth/auth.service')
const { createUser, getUserByEmailWithPassword, isUserRegistered } = require('../user/user.service')

exports.Logon = async (req, res, next) => {
  const email = req.body.email ? req.body.email.trim() : ''
  const password = req.body.password ? req.body.password.trim() : ''

  const user = await getUserByEmailWithPassword(email)
  if (!user) {
    return next(getAppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials'))
  }

  const pwdOK = await passwordsMatch(password, user.password)
  if (!pwdOK) {
    return next(getAppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials'))
  }

  const refreshToken = await getRefreshToken(user)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  })
  const token = await getAccessToken(user)
  res.status(StatusCodes.OK).json({ token })
}

exports.Logoff = async (req, res) => {
  const token = req.cookies['refresh_token']
  await removeRefreshToken(token)
  // Remove cookie
  res.cookie('refresh_token', '', { maxAge: 0 })
  res.status(StatusCodes.OK).json({ message: 'Logged off' })
}

exports.Refresh = async (req, res, next) => {
  const token = await refreshAccessToken(req.cookies['refresh_token'])
  if (!token) {
    return next(getAppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials'))
  }
  res.status(StatusCodes.OK).json({ token })
}

exports.Signup = async (req, res, next) => {
  const errors = []
  const data = {
    name: req.body.name ? req.body.name.trim() : '',
    email: req.body.email ? req.body.email.trim() : '',
    password: req.body.password ? req.body.password.trim() : '',
  }

  const password_confirm = req.body.password_confirm ? req.body.password_confirm.trim() : ''

  if (!data.name) {
    errors.push('An name must be provided')
  }

  if (!isEmail(data.email)) {
    errors.push('An valid email must be provided')
  }

  const registered = await isUserRegistered(data.email)
  if (registered) {
    errors.push('Email is already registered')
  }

  if (!isLength(data.password, { min: 8 })) {
    errors.push('Password must be min 8 chars long')
  }

  if (data.password !== password_confirm) {
    errors.push('Passwords do not match')
  }

  if (errors.length) {
    next(getAppError(StatusCodes.BAD_REQUEST, errors.join(', ')))
  }

  const user = await createUser(data)
  return res.status(StatusCodes.CREATED).json(user)
}
