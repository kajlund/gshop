const log = require('../utils/logger')()

const knexConfig = require('./knexfile')
const dbConfig = knexConfig[process.env.NODE_ENV || 'development']

log.info('Database configuration:', dbConfig)

const knex = require('knex')(dbConfig)

module.exports = knex
