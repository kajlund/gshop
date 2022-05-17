const path = require('path')

const dotenv = require('dotenv')

// Load environment variables BEFORE setting up config
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const ENV = process.env.NODE_ENV || 'development'

const config = {
  development: {
    port: process.env.PORT || 3000,
    log: {
      enabled: true,
      level: 'trace',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    },
  },
  production: {
    port: process.env.PORT || 3000,
    log: {
      enabled: true,
      level: 'info',
      transport: {
        options: {
          colorize: false,
        },
      },
    },
  },
}

module.exports = config[ENV]
