


const { DB, column } = require('./lib/DataBase')
const { server, channel, config } = require('./config')



const DataBase = {



	init: function() {



		/*
			Member
		*/

		DB('discord.member').init({

			id: column.varchar.unique,
			name: column.varchar.null,
			discriminator: column.varchar,
			nick: column.varchar.null,
			avatar: column.varchar.null,
			roles: column.varchar.null,

			joinDate: column.varchar.null,
			leftDate: column.varchar.null,
			roleDate: column.varchar.null,

			experience: column.integer.null,
			message: column.integer.null,
			voice: column.integer.null,

			ban: column.varchar.null, // id member or true
			reason: column.varchar.null
		})

		.catch(console.log)



		/*
			Login, Discriminator, Name, Avatar - log
		*/

		DB('discord.event').init({

			id: column.integer.increment,
			member: column.varchar.null,
			name: column.varchar.null,
			discriminator: column.varchar.null,
			nick: column.varchar.null,
			date: column.varchar.null
		})

		.catch(console.log)



		DB('discord.music').init({

			id: column.integer.increment,
			message: column.varchar,
			member: column.varchar.null,
			name: column.varchar.null,
			link: column.varchar,
			cur: column.integer.null
		})

		.catch(console.log)
	},



	music: {



		all: async function() {

			return await DB('discord.music').fetch()
		},



		get: async function(id) {

			return await DB('discord.music', 'message', id).fetch()
		},



		remove: async function(message) {

			return await DB('discord.music', 'message', message).delete()
		},



		add: async function(data) {

			return await DB('discord.music').insert(data)
		},



		cur: async function(id) {

			let item = await DB('discord.music', id).fetch()

			if (item) {

				await DB('discord.music', 'message', item.message).update({ cur: null })
				await DB('discord.music', id).update({ cur: 1 })

				return true
			}
		}
	},



	roleOfDay: async function() {

		return await DB('discord.member').not('roleDate', [null]).fetch()
	},



	member: {



		events: async function(id) {

			return await DB('discord.event', 'member', id).fetch()
		},



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

				// для долбоёбов, у которых вместо логина параша из символов
				name: member.user.username.match(/^[а-яА-Я\w\s\-\.\(\)]*$/g) ? member.user.username : null,

				discriminator: member.user.discriminator,
				nick: member.nickname,
				avatar: member.user.avatar
			}



			// Создание данных

			if (!result.length) {



				return DB('discord.member')
				.insert(Object.assign({

					joinDate: member.joinedTimestamp,
					roles: JSON.stringify(member._roles)

				}, memberData))
			}



			// Обновление данных

			if (result.length) {

				let data = result.shift()



				if (!data.ban) {

					memberData = Object.assign({

						roles: JSON.stringify(member._roles)

					}, memberData)
				}



				await DB('discord.member', member.user.id).update(memberData)



				// проверяю есть ли изменения логина, дискриминатора или никнейма, но не аватара

				let notchanged = [

					data.name == memberData.name,
					data.discriminator == memberData.discriminator,
					data.nick == memberData.nick

				].every(d => d == true)

				if (notchanged) return



				let events = await DB('discord.event', 'member', memberData.id).fetch()

				// создаём данные со старыми и новыми записями

				if (!events.length) {



					/*
						Первичные данные, когда участник присоединился к серверу
						Если участник никогда не менял логин, дискриминатор и никнейм, то записей в таблице не будет
					*/

					let eventData = {

						member: member.user.id,
						name: data.name,
						discriminator: data.discriminator,
						nick: null,
						date: data.joinDate
					}

					events.push(eventData)

					await DB('discord.event').insert(eventData)
				}



				// Добавляю запись, если нет совпадений

				let found = events.some(e => [

					e.name == memberData.name,
					e.discriminator == memberData.discriminator,
					e.nick == memberData.nick

				].every(d => d == true))



				if (!found) {

					await DB('discord.event').insert({

						member: member.user.id,
						name: memberData.name,
						discriminator: memberData.discriminator,
						nick: memberData.nick,
						date: Date.now()
					})
				}
			}
		},



		sync: async function(member) {

			let result = await DB('discord.member', member.user.id).fetch()



			// если данных нет - новый участник

			if (!result.length)
			return this.save(member)



			try {

				let data = result.shift()

				member.setNickname(data.nick)

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

					// для долбоёбов, у которых вместо логина параша из символов
					name: member.user.username.match(/^[а-яА-Я\w\s\-\.\(\)]*$/g) ? member.user.username : null,

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
