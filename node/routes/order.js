const express = require('express')

const orderController = require('../controller/order')

const router = express.Router()

router.get('/orders',orderController.getOrders)


exports.router = router