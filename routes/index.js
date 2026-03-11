const Router = require('express').Router();
const user = require('./routes.user');
const cart = require("./routes.cart")

Router.use("/user", user);
Router.use("/cart",cart)
module.exports = Router;