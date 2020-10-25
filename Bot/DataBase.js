


const { DB, column } = require('./lib/DataBase')



const DataBase = {



	init: function() {

		DB('discord.member').init({

			id: column.varchar.unique,
			name: column.varchar,
			discriminator: column.integer,
			nick: column.varchar.null,
			avatar: column.varchar.null,

			joinDate: column.varchar.null,
			leftDate: column.varchar.null,
			roles: column.varchar.null,
			experience: column.integer.null,
			voice: column.varchar.null, // voice time
			message: column.integer.null // message count
		})

		.catch(console.log)
	},



	member: {

		get: async function(id) {

			let member = await DB('discord.member', id).fetch()
			return member.shift()
		},

		update: async function(id, data) {

			return await DB('discord.member', id).update(data)
		}
	}
}

DataBase.init()

module.exports = { DataBase, DB }
