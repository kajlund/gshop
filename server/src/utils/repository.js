const { nanoid } = require('nanoid')

const db = require('../db')

exports.findOne = async (table, fields = '*', filter = {}) => {
  const rows = await db(table).select(fields).where(filter)
  return rows && rows.length ? rows[0] : null
}

exports.insertOne = async (table = '', data = {}) => {
  let inserted = null
  data.id = nanoid()
  const rows = await db.insert(data).into(table)
  if (rows) {
    inserted = await exports.findOne(table, '*', { id: data.id })
  }
  return inserted
}

exports.destroyOne = async (table, filter = { id: '' }) => {
  const rows_affected = await db(table).where(filter).del()
  return rows_affected === 1
}

exports.updateOne = async (table, filter = {}, data = {}) => {
  let updated = null
  const rows = await db(table).where(filter).update(data)
  if (rows) {
    updated = await exports.findOne(table, '*', filter)
  }
  return updated
}
