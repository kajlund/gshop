const log = require('../utils/log')

const knexConfig = require('./knexfile')
const dbConfig = knexConfig[process.env.NODE_ENV || 'development']

log.info(dbConfig, 'Database configuration:')

const knex = require('knex')(dbConfig)

module.exports = knex
