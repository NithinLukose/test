const Product = require('../models/products')

exports.addToCart = async (req,res) => {
    const id = req.params.id
    let cart = await req.user.getCart();
    let cartItems = await cart.getProducts({
        where:{id:id}
    }).catch(err=>console.log(err))
    let cartItem;
    if(cartItems.length>0){
        cartItem = cartItems[0]
    }
    let newQuantity = 1;
    if(cartItem){
        const oldQuantity = cartItem.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        await cart.addProduct(cartItem, { through:{ quantity:newQuantity } })
    }
    else{
        let product = await Product.findByPk(id)
        await cart.addProduct(product, { through:{ quantity:newQuantity } })
    }    
    res.sendStatus(200)
}

exports.fetchCartItems = async (req,res) => {
    let cart = await req.user.getCart();
    let cartItems = await cart.getProducts()
    res.send(cartItems)
}

exports.changeQuantity = async (req,res) => {
    let id = req.params.id
    let increment = req.query.increment === 'true'?true:false

    let cart = await req.user.getCart();
    let cartItems = await cart.getProducts({
        where:{id:id}
    }).catch(err=>console.log(err))
    let product;
    if(cartItems.length>0){
        product = cartItems[0]
    }
    let newQuantity;
    if(increment){
        newQuantity = product.cartItem.quantity + 1;
    }
    else{
        newQuantity = product.cartItem.quantity - 1;
    }
    if(newQuantity === 0){
        cartItems = await cart.getProducts().catch(err=>console.log(err))
        res.send(cartItems)
    }
    else{
        await cart.addProduct(product, { through:{ quantity:newQuantity } })
        cartItems = await cart.getProducts().catch(err=>console.log(err))
        res.send(cartItems)
    }    
}

exports.deleteItemFromCart = async (req,res) => {
    let id = Number(req.params.id)
    let cart = await req.user.getCart();
    let cartItems = await cart.getProducts({
        where:{id:id}
    }).catch(err=>console.log(err))
    let product;
    if(cartItems.length>0){
        product = cartItems[0]
    }
    await product.cartItem.destroy()
    cartItems = await cart.getProducts().catch(err=>console.log(err))
    res.send(cartItems)
}

exports.orderCartItems = async (req,res) => {
    let cart = await req.user
        .getCart()
        .catch(err=>console.log(err));
    let products = await cart.getProducts()
        .catch(err=>console.log(err));
    let order = await req.user
        .createOrder()
        .catch(err=>console.log(err));

    order.addProducts(products.map(product=>{
        product.orderItem = { quantity: product.cartItem.quantity }
        return product
    }))

    await cart.setProducts(null)
    .catch(err=>console.log(err));
    
    res.sendStatus(200)
}