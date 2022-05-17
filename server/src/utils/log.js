const pino = require('pino')
const cnf = require('../config')

const log = pino(cnf.log)
log.info(cnf.log, 'Logger configured')

module.exports = log
