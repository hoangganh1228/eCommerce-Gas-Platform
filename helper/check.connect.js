'use strict'

const { default: mongoose } = require("mongoose")
const _SECONDS = 500000
const os = require('os')
const process = require("process")

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections:::${numConnection}`);
}

// check overload
const checkOverload = () => {
  setInterval( () => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number osf core
    const maxConnections = numCores * 5;
    console.log(`Activate connection: ${numConnection}`);
    
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    
    if(numConnection > maxConnections) {
      console.log("Connection overload detected");
      
    }
  }, _SECONDS ) // Monitor every 5s
}

module.exports = {
  countConnect,
  checkOverload
}