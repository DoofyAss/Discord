


global.fs = require('fs')
global.path = require('path')



require('./System')
require('./Client')
require('./SQL')



for (mod of client.scan('module')) {

	console.dir(`module { \x1b[33m${ mod.name }\x1b[37m }`)

	require(mod.path).each((name, context) => {

		global[name] = global[name] ?
		Object.assign( global[name], context ) : context
	})
}



module.exports = callback => callback()



process.on('uncaughtException', exception => console.log(exception))
