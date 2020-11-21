


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
			voice: column.integer.null,

			ban: column.varchar.null, // id member or true
			reason: column.varchar.null
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



			let memberData = {

				id: member.user.id,
				name: member.user.username,
				discriminator: member.user.discriminator,
				avatar: member.user.avatar
			}



			// Обновление данных

			if (result.length) {

				let data = result.shift()



				// История никнеймов
				let nicknames = JSON.parse(data.nick ?? '[]')

				// добавляем никнейм, если его нет в базе данных
				if (!nicknames.includes(member.nickname))
				nicknames.push(member.nickname)

				// Текущий никнейм смещаем в начало
				nicknames.sort((a, b) => a == member.nickname ? -1 : b == member.nickname ? 1 : 0)
				nicknames = JSON.stringify(nicknames)


				if (!data.ban) {

					memberData = Object.assign({

						roles: JSON.stringify(member._roles)

					}, memberData)
				}



				DB('discord.member', member.user.id)
				.update(Object.assign({

					nick: nicknames == '[null]' ? null : nicknames

				}, memberData))
			}



			// Создание данных

			if (!result.length) {



				DB('discord.member')
				.insert(Object.assign({

					joinDate: member.joinedTimestamp,
					roles: JSON.stringify(member._roles),
					nick: member.nickname ? JSON.stringify([member.nickname]) : null

				}, memberData))
			}
		},



		sync: async function(member) {

			let result = await DB('discord.member', member.user.id).fetch()

			// если данных нет - новый участник
			if (!result.length)
			return this.save(member)



			try {

				let data = result.shift()

				// получаю историю никнеймов
				let nicknames = JSON.parse(data.nick)
				// возвращаю последний никнейм
				if (nicknames) member.setNickname(nicknames.shift())



				// получаю сохранённые роли
				let roles = JSON.parse(data.roles)
				if (!data.ban) {

					let index = roles.indexOf(config.roleJoin)
					if (index > -1) roles.splice(index, 1)

					// возвращаю все роли, кроме главной
					roles.forEach(role => member.roles.add(role))

				} else {

					// если участник заблокирован
					member.roles.add(config.rolePrison)
				}



				data = {

					name: member.user.username,
					discriminator: member.user.discriminator,
					avatar: member.user.avatar,
					leftDate: null
				}

				DB('discord.member', member.user.id).update(data)

			} catch(e) { }
		}
	}
}

DataBase.init()

module.exports = { DataBase, DB }
