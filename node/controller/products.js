const Product = require('../models/products')
const Cart = require('../models/cart')

exports.getAllProducts = async (req,res) => {
    let products = await req.user.getProducts();
    console.log(products)
    res.send(products)
}

exports.getProductDetails = async (req,res)=>{
    let id = Number(req.params.productId)
    let product = await Product.findByPk(id)
    console.log(product)
    res.send(product)
}
exports.deleteProduct = async (req,res) => {
    let id = Number(req.params.id);
    await Product.destroy({
        where:{
            id:id
        }
    })
    let products = await Product.findAll()
    let cart = Cart.deleteItemFromCart(id)
    res.send(products)
}

exports.editProduct = async (req,res) => {
    let id = Number(req.params.id);
    let editedProduct = req.body;
    let name = editedProduct.name;
    let productPrice = Number(editedProduct.productPrice);
    let imageUrl = editedProduct.imageUrl;
    let rating = Number(editedProduct.rating);
    await Product.update({
        name,
        imageUrl,
        productPrice,
        rating
    },
    {
        where:{
            id:id,
            userId:req.user.id
        }
    })
    res.json(editedProduct)
}

exports.addProduct = async (req,res) => {
    let product = req.body;
    let name = product.name;
    let productPrice = Number(product.productPrice);
    let imageUrl = product.imageUrl;
    let rating = Number(product.rating);
    
    let newProduct = await req.user.createProduct({
        name,
        imageUrl,
        productPrice,
        rating
    })
    res.json(newProduct)
}