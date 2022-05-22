const { compare } = require('bcryptjs')
const { isAfter } = require('date-fns')
const { sign, verify } = require('jsonwebtoken')

// const { byId, createUser, emailRegistered } = require('../user/user.service')

const db = require('../../db')
const log = require('../../utils/log')

const getAccessToken = async (user) => sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: '30s' })

const getRefreshToken = async (user) => {
  const token = sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '1w' })
  const expired_at = new Date()
  expired_at.setDate(expired_at.getDate() + 7)

  // Save refresh token in DB. Expires in oine week
  await db('tokens').insert({ user_id: user.id, token, expired_at })
  log.info(`Added refresh token: ${token}`)
  return token
}

const passwordsMatch = async (pwd1, pwd2) => {
  const pass = await compare(pwd1, pwd2)
  return pass
}

const removeRefreshToken = async (token) => {
  // Remove refresh token from DB (Logout)
  const rows_affected = await db('tokens').where({ token }).del()
  if (rows_affected !== 1) {
    log.error(`removeRefreshToken: Delete for token ${token} returned ${rows_affected} rows.`)
    return false
  }
  return true
}

const refreshAccessToken = async (cookie) => {
  const payload = verify(cookie, process.env.REFRESH_SECRET)
  if (!payload) {
    log.error('Refresh token cookie verification failed')
    return ''
  }

  // Also verify with DB
  const rows = await db('tokens').select('id', 'expired_at').where('user_id', payload.id)
  if (!rows.length) {
    log.error(payload, 'Token could not be found in DB')
    return ''
  }

  const refreshToken = rows[0]
  if (!refreshToken || !isAfter(refreshToken.expired_at, new Date())) {
    log.error(refreshToken, 'Refresh token might have expired')
    return ''
  }

  return sign({ id: payload.id }, process.env.ACCESS_SECRET, { expiresIn: '30s' })
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  passwordsMatch,
  refreshAccessToken,
  removeRefreshToken,
}
