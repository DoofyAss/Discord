


const { DB, column } = require('./DataBase')
const { server, channel, config } = require('./config')

DB('discord.user')
.init({

	id: column.increment,
	name: column.varchar.unique,
	level: column.integer.null
})
.catch(console.log)
