const { hashPassword } = require('../../utils/auth')
const { isEmail, isLength, trim } = require('validator')

const { findOne, insertOne } = require('../../utils/repository')
const { getNotFoundError, getUnprocessableError } = require('../../utils/errors')

// const _dbToEntity = (dbData) => {
//   const data = {
//     id: dbData.id,
//     name: dbData.name,
//     email: dbData.email,
//   }

//   return data
// }

const _validateUser = async (userData = {}) => {
  const errors = []
  const data = {
    name: userData.name ? trim(userData.name) : '',
    email: userData.email ? trim(userData.email) : '',
    password: userData.password ? trim(userData.password) : '',
  }

  const password_confirm = userData.password_confirm ? trim(userData.password_confirm) : ''
  if (password_confirm !== data.password) {
    errors.add('Passwords do not match')
  }

  if (!data.name) {
    errors.add('A user needs to have a name')
  }

  if (!isEmail(data.email)) {
    errors.add('A user needs to have a valid email address')
  }

  const isRegistered = await isUserRegistered(data.email)
  if (isRegistered) {
    errors.push(`Email ${data.email} is already registered`)
  }

  if (!isLength(data.password, { min: 8, max: 50 })) {
    errors.add('Password should be between 8 and 50 characters long')
  }

  if (errors.length) {
    return [errors, null]
  } else {
    return [null, data]
  }
}

exports.getUserById = async (id) => {
  const user = await findOne('users', ['id', 'name', 'email'], { id })
  return user
}

exports.createUser = async (bodyData) => {
  const [errors, data] = await _validateUser(bodyData)
  if (errors) {
    throw getUnprocessableError(errors.join(','))
  }

  data.password = await hashPassword(data.password)
  const newUser = await insertOne('users', data)
  return newUser
}

const isUserRegistered = async (email) => {
  const user = await findOne('users', ['id', 'name', 'email'], { email })
  if (user) {
    return true
  }
  return false
}

exports.getUserByEmail = async (email) => {
  const user = await findOne('users', ['id', 'name', 'email', 'isAdmin'], { email })
  if (!user) {
    throw getNotFoundError()
  }
  return user
}

exports.getUserByEmailWithPassword = async (email) => {
  const user = await findOne('users', ['id', 'name', 'email', 'password', 'isAdmin'], { email })
  if (!user) {
    throw getNotFoundError()
  }
  return user
}

exports.getUserProfile = async (id) => {
  const user = await exports.getUserById(id)
  // Add profileinfo here
  if (!user) {
    throw getNotFoundError()
  }
  return user
}
