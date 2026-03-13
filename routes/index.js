const Router = require('express').Router();
const user = require('./routes.user');
const cart = require("./routes.cart")
const wishlist = require("./routes.wishlist")

Router.use("/user", user);
Router.use("/cart",cart)
Router.use("/wishlist",wishlist)

module.exports = Router;