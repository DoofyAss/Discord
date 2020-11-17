


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



		all: async function() {

			let member = await DB('discord.member').fetch()

			return member
			.filter(member => member.leftDate == null)
			.map(member => member.id)
		},



		get: async function(id) {

			let member = await DB('discord.member', id).fetch()
			return member.shift()
		},



		update: async function(id, data) {

			return await DB('discord.member', id).update(data)
		},



		save: async function(member) {

			let result = await DB('discord.member', member.user.id).fetch()



			let data = {

				id: member.user.id,
				name: member.user.username,
				discriminator: member.user.discriminator,
				avatar: member.user.avatar,

				roles: JSON.stringify(member._roles)
			}



			// Обновление данных

			if (result.length) {



				// История никнеймов

				let nicknames = JSON.parse(result.shift().nick ?? '[]')

				// добавляем никнейм, если его нет в базе данных
				if (!nicknames.includes(member.nickname))
				nicknames.push(member.nickname)

				// Текущий никнейм смещаем в начало
				nicknames.sort((a, b) => a == member.nickname ? -1 : b == member.nickname ? 1 : 0)



				DB('discord.member', member.user.id)
				.update(Object.assign({

					nick: JSON.stringify(nicknames)

				}, data))
			}



			// Создание данных

			if (!result.length) {



				DB('discord.member')
				.insert(Object.assign({

					joinDate: member.joinedTimestamp,
					nick: member.nickname ? JSON.stringify([member.nickname]) : null

				}, data))
			}
		},



		sync: async function(member) {

			let result = await DB('discord.member', member.user.id).fetch()

			if (!result.length)
			return this.save(member)



			let data = result.shift()

			let nicknames = JSON.parse(data.nick)
			if (nicknames) member.setNickname(nicknames.shift())

			JSON.parse(data.roles).forEach(role => member.roles.add(role))



			data = {

				name: member.user.username,
				discriminator: member.user.discriminator,
				avatar: member.user.avatar,
				leftDate: null
			}

			DB('discord.member', member.user.id).update(data)
		}
	}
}

DataBase.init()

module.exports = { DataBase, DB }
