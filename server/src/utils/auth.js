const jwt = require('jsonwebtoken')
const { compare, hash } = require('bcryptjs')

const cnf = require('../config')

exports.generateAccessToken = (payload, options = {}) => {
  const { expiresIn = '30s' } = options
  return jwt.sign(payload, cnf.jwtAccessTokenSecret, { expiresIn })
}

exports.generateRefreshToken = (payload, options = {}) => {
  const { expiresIn = '1w' } = options
  return jwt.sign(payload, cnf.jwtRefreshTokenSecret, { expiresIn })
}

exports.hashPassword = async (pwd) => {
  const hashed = await hash(pwd, 12)
  return hashed
}

exports.passwordsMatch = async (pwd1, pwd2) => {
  const pass = await compare(pwd1, pwd2)
  return pass
}

exports.verifyAccessToken = (token) => jwt.verify(token, cnf.jwtAccessTokenSecret)
exports.verifyRefreshToken = (token) => jwt.verify(token, cnf.jwtRefreshTokenSecret)
