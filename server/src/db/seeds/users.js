/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { nanoid } = require('nanoid')

const { hashPassword } = require('../../utils/auth')

exports.seed = async function (knex) {
  const pwd = await hashPassword('12345678')
  const adminId = nanoid()
  const userId = nanoid()
  const users = [
    { id: userId, name: 'user', email: 'u@u.com', password: pwd, isAdmin: false },
    { id: adminId, name: 'admin', email: 'a@a.com', password: pwd, isAdmin: true },
  ]
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert(users)
}
