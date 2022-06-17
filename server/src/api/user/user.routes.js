const express = require('express')

const { protect } = require('../../middleware/auth')
const { profile } = require('./user.handlers')

const router = express.Router()

router.get('/profile', protect, profile)

module.exports = router
