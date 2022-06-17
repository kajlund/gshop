const { isAfter } = require('date-fns')

const { getInternalServerError, getUnauthorizedError } = require('../../utils/errors')
const { getUserByEmailWithPassword, createUser } = require('../user/user.service')
const { generateAccessToken, generateRefreshToken, passwordsMatch, verifyRefreshToken } = require('../../utils/auth')
const { destroyOne, findOne, insertOne, updateOne } = require('../../utils/repository')
const log = require('../../utils/logger')()

const _getTokenPayload = (data) => {
  return { id: data.id, isAdmin: data.isAdmin === 1 }
}

const _addTokenToDB = async (userId, token) => {
  const expired_at = new Date()
  expired_at.setDate(expired_at.getDate() + 7)
  const oldToken = await findOne('tokens', [], { token })
  if (!oldToken) {
    await insertOne('tokens', { user_id: userId, token, expired_at })
  } else {
    await updateOne('tokens', { id: oldToken.id }, { expired_at })
  }
}

exports.logonUser = async (data) => {
  const { email, password } = data
  let accessToken, refreshToken
  const user = await getUserByEmailWithPassword(email)
  if (!user) {
    throw getUnauthorizedError()
  }

  const pwdOK = await passwordsMatch(password, user.password)
  if (!pwdOK) {
    throw getUnauthorizedError()
  }

  const payload = _getTokenPayload(user)
  accessToken = generateAccessToken(payload)
  refreshToken = generateRefreshToken(payload)
  await _addTokenToDB(user.id, refreshToken)
  if (!accessToken || !refreshToken) {
    throw getUnauthorizedError()
  }

  return { accessToken, refreshToken }
}

exports.logoffUser = async (token) => {
  // Remove refresh token from DB (Logout)
  if (token) {
    const deleted = await destroyOne('tokens', { token })
    if (deleted) {
      log.info(`logoffUser: Deleted token ${token}`)
    }
  }
}

exports.refreshAccessToken = async (token) => {
  const payload = verifyRefreshToken(token)
  if (!payload) {
    throw getUnauthorizedError('Token verification failed')
  }

  // Also verify with DB
  const resfreshToken = await findOne('tokens', '*', { token })
  if (!resfreshToken) {
    throw getInternalServerError('refreshAccessToken: Token could not be found in DB')
  }

  if (!isAfter(resfreshToken.expired_at, new Date())) {
    throw getUnauthorizedError('Refresh token has expired')
  }
  const accessToken = generateAccessToken({ id: payload.id, isAdmin: payload.isAdmin })
  return accessToken
}

exports.signupUser = async (data) => {
  const user = await createUser(data)
  // maybe logon after created?
  const payload = _getTokenPayload(user)
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  await _addTokenToDB(user.id, refreshToken)
  if (!accessToken || !refreshToken) {
    throw getUnauthorizedError()
  }

  return { accessToken, refreshToken }
}
