const express = require('express')

const { logoff, logon, refreshAccessToken, signupUser } = require('./auth.handler')

const router = express.Router()

router.post('/logon', logon)
router.get('/logoff', logoff)
router.get('/refresh', refreshAccessToken)
router.post('/signup', signupUser)

module.exports = router
