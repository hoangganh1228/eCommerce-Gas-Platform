'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

// Checko API Key

// Check permission

// Sign up
router.post('/shop/signup', accessController.signUp)


module.exports = router
