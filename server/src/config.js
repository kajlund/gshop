const path = require('path')

const dotenv = require('dotenv')

// Load environment variables BEFORE setting up config
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const ENV = process.env.NODE_ENV || 'development'
const PORT = parseInt(process.env.PORT) || 8080
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10
const jwtAccessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
const jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET

const config = {
  development: {
    port: PORT,
    nodeEnv: ENV,
    saltRounds,
    jwtAccessTokenSecret,
    jwtRefreshTokenSecret,
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
    port: PORT,
    nodeEnv: ENV,
    saltRounds,
    jwtAccessTokenSecret,
    jwtRefreshTokenSecret,
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
