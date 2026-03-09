const Router = require('express').Router();
const user = require('./services');

Router.use('/user', user);

module.exports = Router;