#!/usr/bin/env node

/**
 * Application entry point.
 * Loads environment variables (.env in root folder), config and log.
 * Sets up DB connection(s), gets app instance and starts http server.
 */

const http = require('http')
const util = require('util')

const config = require('./config')

const log = require('./utils/log')
const App = require('./app')

const db = require('./db')

async function startServer() {
  /* Get configured app */
  const app = App(config, db)

  /* Create HTTP Server */
  const server = http.createServer(app)

  server.on('listening', () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    log.info(`Server listening on ${bind}`)
  })

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof config.PORT === 'string' ? `Pipe ${app.get('port')}` : `Port  ${app.get('port')}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        log.error(`${bind} requires elevated privileges`)
        throw error
      case 'EADDRINUSE':
        log.error(`${bind} is already in use`)
        throw error
      default:
        throw error
    }
  })

  /* Start server */
  server.listen(config.port)
}

process.on('uncaughtException', (err) => {
  log.error(`UNCAUGHT EXCEPTION - ${err.stack || err}`)
  throw err
})

process.on('unhandledRejection', (reason, p) => {
  log.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`)
})

log.info('Starting server')
startServer()
  .then(() => log.info('Server started OK'))
  .catch((err) => {
    log.error(err)
    throw err
  })
