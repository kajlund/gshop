const { hash } = require('bcryptjs')
const { nanoid } = require('nanoid')

const db = require('../../db')
const log = require('../../utils/log')

const getUserById = async (id) => {
  const rows = await db('users').select('id', 'name', 'email').where({ id })
  return rows && rows.length ? rows[0] : null
}

const createUser = async (data) => {
  const { name, email, password } = data
  const id = nanoid()
  const pwd = await hash(password, 12)
  await db('users').insert({
    id,
    name,
    email,
    password: pwd,
  })

  // Fetch and return created user
  const user = await getUserById(id)
  log.info(user, 'User service created user:')
  return user
}

const isUserRegistered = async (email) => {
  const rows = await db('users').select('id').where({ email })
  if (rows.length) {
    return true
  }
  return false
}

const getUserByEmail = async (email) => {
  const rows = await db('users').select('id', 'name', 'email').where({ email })
  rows && rows.length ? rows[0] : null
}

const getUserByEmailWithPassword = async (email) => {
  const rows = await db('users').select('id', 'name', 'email', 'password').where({ email })
  return rows && rows.length ? rows[0] : null
}

const getUserProfile = async (id) => {
  const user = await getUserById(id)
  // Add profileinfo here
  return user
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByEmailWithPassword,
  getUserById,
  getUserProfile,
  isUserRegistered,
}
