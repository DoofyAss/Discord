


const { DB, column } = require('./DataBase')
const { server, channel, config } = require('./config')

DB('discord.user')
.catch(console.log)
.init({

	id: column.varchar.unique,
	// id: column.increment,
	name: column.varchar.null,
	level: column.integer.null
})
