'use strict'

// lv0
// const config = {
//   app: {
//     port: 3000
//   },
//   db: {
//     host: 'localhost',
//     port: 27017,
//     name: 'db'
//   }
// }

const dev = {
  app: {
    port: 3000
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'shopDEV'

  }
}

const pro = {
  app: {
    port: 3000
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'dbProduct'
  }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

// console.log(config[env], env);   

module.exports = config[env]