const Router = require('express').Router();
const user = require('./routes.user');
const cart = require("./routes.cart")
const wishlist = require("./routes.wishlist")
const order = require("./routes.order")
const product = require("./routes.products")
const category = require("./routes.categories")
const stripe = require("./routes.stripe")

Router.use("/user", user);
Router.use("/cart",cart)
Router.use("/wishlist",wishlist)
Router.use("/order",order)
Router.use("/product",product)
Router.use("/category",category)
Router.use("/stripe",stripe)

module.exports = Router;