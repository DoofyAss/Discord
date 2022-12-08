


global.fs = require('fs')
global.path = require('path')



require('./System')
require('./Client')
require('./SQL')



module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
