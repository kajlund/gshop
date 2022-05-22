const express = require('express')

const { protect } = require('../../middleware/auth')
const { Profile } = require('./user.controller')

const router = express.Router()

router.get('/profile', protect, Profile)

module.exports = router
