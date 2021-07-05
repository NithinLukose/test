const express = require('express')

const cartsController = require('../controller/cart')

const router = express.Router()

router.get('/cart/addToCart/:id',cartsController.addToCart)
router.get('/cart/changeQuantity/:id',cartsController.changeQuantity)
router.delete('/cart/:id',cartsController.deleteItemFromCart)
router.get('/cart',cartsController.fetchCartItems)
router.get('/cart/checkout',cartsController.orderCartItems)


exports.router = router