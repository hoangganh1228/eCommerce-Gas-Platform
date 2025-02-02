'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
