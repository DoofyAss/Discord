


const { DB, column } = require('./lib/DataBase')
const { server, channel, config } = require('./config')



const DataBase = {



	init: function() {

		DB('discord.member').init({

			id: column.varchar.unique,
			name: column.varchar,
			discriminator: column.varchar,
			nick: column.varchar.null,
			avatar: column.varchar.null,
			roles: column.varchar.null,

			joinDate: column.varchar.null,
			leftDate: column.varchar.null,

			experience: column.integer.null,
			message: column.integer.null,
			voice: column.integer.null
		})

		.catch(console.log)
	},



	member: {



		all: async function() {

			let member = await DB('discord.member', 'leftDate', null).fetch()
			return member.map(member => member.id)
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
				nicknames = JSON.stringify(nicknames)



				DB('discord.member', member.user.id)
				.update(Object.assign({

					nick: nicknames == '[null]' ? null : nicknames

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

			if (!result.length) {

				this.save(member)
				return false
			}




			let data = result.shift()

			let nicknames = JSON.parse(data.nick)
			if (nicknames) member.setNickname(nicknames.shift())

			JSON.parse(data.roles).forEach(role => {

				if (role != config.joinRole) member.roles.add(role)
			})



			data = {

				name: member.user.username,
				discriminator: member.user.discriminator,
				avatar: member.user.avatar,
				leftDate: null
			}

			DB('discord.member', member.user.id).update(data)

			return true
		}
	}
}

DataBase.init()

module.exports = { DataBase, DB }
