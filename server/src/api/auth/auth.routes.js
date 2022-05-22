const express = require('express')
const { Logoff, Logon, Refresh, Signup } = require('./auth.controller')

const router = express.Router()

router.post('/signup', Signup)
router.post('/logon', Logon)
router.get('/refresh', Refresh)
router.get('/logoff', Logoff)

module.exports = router
