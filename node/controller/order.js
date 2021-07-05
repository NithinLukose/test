exports.getOrders = async (req,res) => {
    let orders = await req.user.getOrders({include:['products']})
    console.log(orders)
    res.send(orders)
}