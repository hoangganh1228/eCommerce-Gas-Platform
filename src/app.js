const express= require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require("compression");

const app = express()

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.get('/', (req, res, next) => {
  const strCompress = "Hello Mo";

  return res.status(200).json({
    message: 'Welcome Mo',
    metadata: strCompress.repeat(100000)
  })
})

module.exports = app