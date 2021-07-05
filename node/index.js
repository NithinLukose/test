const express = require('express')
const cors = require('cors')

const productRoute = require('./routes/products')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')

const sequelize = require('./util/database')
const Product = require('./models/products')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')
const Order = require('./models/order')
const OrderItem = require('./models/orderItem')

const app = express();

app.use(cors())
app.use(express.urlencoded({
    extended:false
}))
app.use(express.json())
app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user = user
        next()
    })
    .catch(err=>console.log(err))
})
app.use(productRoute.router)
app.use(cartRoute.router)
app.use(orderRoute.router)

Product.belongsTo(User,{constraint:true,onDelete:'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{ through: OrderItem})
Product.belongsToMany(Order,{ through: OrderItem})

sequelize.sync({force:true}).then(result => {
    return User.findByPk(1)
    
})
.then(user=>{
    if(!user){
        return User.create({name:"nithin lukose",email:'test@gmail.com'})
    }
    return user
})
.then(user=>{
    //console.log(user)
    return user.createCart()
    
})
.then(cart=>{
    app.listen(3001)
})
.catch(error=>{
    console.log(error)
})