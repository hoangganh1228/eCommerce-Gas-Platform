const express= require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression");

const app = express()

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init DB
require("./dbs/init.mongodb")
const { checkOverload } = require("../helper/check.connect")
checkOverload();

app.get('/', (req, res, next) => {

  return res.status(200).json({
    message: 'Welcome Mo',
  })
})

module.exports = app