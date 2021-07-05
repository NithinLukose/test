const express = require('express')

const productsController = require('../controller/products')

const router = express.Router()

router.get('/',productsController.getAllProducts)
router.get('/product/:productId',productsController.getProductDetails)
router.get('/admin/products',productsController.getAllProducts)
router.delete('/admin/product/:id',productsController.deleteProduct)
router.put('/admin/editProduct/:id',productsController.editProduct)
router.post('/admin/addproduct',productsController.addProduct)

exports.router = router