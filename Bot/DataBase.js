


const { DB, column } = require('./lib/DataBase')



let DataBase = {



	init: function() {

		DB('discord.member')
		.catch(console.log)
		.init({

			id: column.varchar.unique,
			name: column.varchar,
			discriminator: column.integer,
			nick: column.varchar.null,
			avatar: column.varchar.null,

			joinDate: column.varchar.null,
			leftDate: column.varchar.null,
			roles: column.varchar.null,
			level: column.integer.null,
			voice: column.varchar.null, // voice time
			message: column.integer.null // message count
		})
	}
}

.init()



module.exports = { DataBase, DB }
