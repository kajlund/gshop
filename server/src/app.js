/**
 * App object configures express server middleware and routes
 */
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
require('express-async-errors') // async wrapper

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')

// Configure server
module.exports = (cnf, db) => {
  const app = express()

  app.disable('x-powered-by')
  const port = parseInt(cnf.PORT, 10)
  app.set('port', port)
  app.set('db', db)

  // Configure middleware
  app.use(express.json({ limit: '1000kb' })) // Limit input data size for security reasons
  app.use(express.urlencoded({ extended: false })) // Support also form input
  app.use(cookieParser())
  // const whitelist = ['http://localhost:8080' /** other domains if any */]
  // const corsOptions = {
  //   credentials: true,
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   },
  // }
  app.use(cors())

  // Add route handlers
  app.get('/', (req, res) => {
    res.json({ message: 'Server running' })
  })

  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/users', userRoutes)

  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
