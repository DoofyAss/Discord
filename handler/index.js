


// global.fs = require('fs')

require('./System')
require('./SQL')
// require('./DataBase')
// require('./Client')


// require.main.require('./module/DataBase')

// let path = require.main.require('./module')











process.on('uncaughtException', exception => console.log(exception))
