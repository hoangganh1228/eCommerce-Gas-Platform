require('dotenv').config()
const express= require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression");

const app = express()
// Middleware để xử lý JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init DB
require("./dbs/init.mongodb")
const { checkOverload } = require("../helper/check.connect")
checkOverload();

app.use('/', require('./routes/index'))

// handing error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})


app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app