'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// Check apiKey
router.use(apiKey)

// check permission
router.use(permission('0000'))

router.use('/v1/api/checkout', require('./checkout'))

router.use('/v1/api/discount', require('./discount'))

router.use('/v1/api/cart', require('./cart'))

router.use('/v1/api/product', require('./product'))

router.use('/v1/api', require('./access'))

// router.get('', (req, res, next) => {

//   return res.status(200).json({
//     message: 'Welcome Mo',
//   })
// })

module.exports = router
