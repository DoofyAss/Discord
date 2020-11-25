


const { lib } = require('./lib/lib.js')
const { DataBase, DB } = require('./DataBase')
const { server, channel, config } = require('./config')

const { Client } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });










const Guild = {



	get cache() {

		return client.guilds.cache.get(server.id)
	},



	get member() {

		return this.cache.members.cache
	},



	get bot() {

		return this.member.get(client.user.id)
	},



	get channel() {

		return this.cache.channels.cache
	},



	get online() {

		return (async () => {

			let members = await this.cache.members.fetch()
			return members.map(m => m.guild.presences.cache).shift()
        })()
	}
}










const Event = {



	join: async function(id) {



		let notify = Guild.channel.get(channel.notify)
		let _member = await Guild.member.get(id)
		let member = await Member.get(id)



		// вернувшийся участник

		if (member) {



			// если участник заблокирован

			if (member.ban) {

				// если прошло больше суток с момента ухода

				if (parseInt(member.leftDate) + 86400000 < Date.now()) {

					let replys = [

						'Ухади ацуда!',
						'Тебя не ждали.',
						'Тебе здесь не рады.',
						'Без тебя было лучше.',
						'От тебя гавной воняет, даже отсюда, телефона чувствую.',
					]

					notify.send(`<@${id}> ${replys.random}`)
				}
			}



			// если участник не заблокирован

			if (!member.ban) {

				// если прошло больше суток с момента ухода

				if (parseInt(member.leftDate) + 86400000 < Date.now()) {

					let replys = [

						'Ну и где это мы были?',
						'Выйди и зайди нормально.',
						'И зачем надо было выходить?',
						'Даже знать не хочу где тебя носило...',
						'Можешь уходить обратно, я тебя больше не люблю 💔'
					]

					notify.send(`<@${id}> ${replys.random}`)
				}
			}



			notify.send({ embed: {

				color: !member.ban ? null : 0xf87845,
				description: 'Возвращается',
				author: {

					name: _member.user.username,
					icon_url: _member.user.avatar ? `https://cdn.discordapp.com/avatars/${_member.user.id}/${_member.user.avatar}.png?size=64` : null
				},
				footer: !member.ban ? null : {

					text: member.reason ? `Заблокирован. \ \ Причина: \ \ ${member.reason}` : 'Заблокирован'
				}
	        }})
		}



		// новый участник

		if (!member) {



			notify.send({ embed: {

				color: 0x7289da,
				description: 'Присоединяется',
				author: {

					name: _member.user.username,
					icon_url: _member.user.avatar ? `https://cdn.discordapp.com/avatars/${_member.user.id}/${_member.user.avatar}.png?size=64` : null
				}

	        }}).then(m => m.react('👋'))
		}



		DataBase.member.sync(_member)
	},










	left: async function(id) {



		let Bans = await Guild.cache.fetchBans()
		let ban = Bans.get(id)



		let member = await Member.get(id)
		member.leftDate = Date.now()



		// Участник заблокирован

		if (ban) {

			Guild.channel.get(channel.notify)
			.send({ embed: {

				color: 0xdd2e44,
				description: 'Заблокирован',
				author: {

					name: member.name,
					icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
				},
				footer: {

					text: ban.reason ? `Причина: \ \ ${ban.reason}` : null
				}
			}})
		}



		// Участник ушёл

		if (!ban) {

			Guild.channel.get(channel.notify)
			.send({ embed: {

				description: 'Уходит',
				author: {

					name: member.name,
					icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
				}
			}})
		}



		joinRoleRemove(id)
	},










	banRemove: async function(id) {

		let member = await Member.get(id)

		Guild.channel.get(channel.notify)
		.send({ embed: {

			author: {

				name: member.name,
				icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
			},
			description: 'Разблокирован'
		}})
	},










	Jail: async function(author, member, reason) {

		Guild.channel.get(channel.notify)
		.send({ embed: {

			color: 0xf87845,
			description: 'Заблокирован',
			author: {

				name: member.name,
				icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
			},
			footer: {

				text: reason ? `Причина: \ \ ${reason}` : null
			}
		}})
	},



	unJail: async function(author, member) {

		Guild.channel.get(channel.notify)
		.send({ embed: {

			description: 'Разблокирован',
			author: {

				name: member.name,
				icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
			}
		}})
	}
}










const Member = {



	handler: {

		get: function(target, name) { return target[name] },

		set: async function(target, name, value) {

			target[name] = value
			DataBase.member.update(target.id, { [name]: value })
		}
	},



	get: async function(id, callback) {

		let data = await DataBase.member.get(id)

		if (data) {

			let proxy = new Proxy(data, this.handler)

			if (callback) callback(proxy)
			return proxy
		}
	}
}














client.on('guildMemberAdd', async member => {

	if (member.bot) return

	Event.join(member.id)
})



client.on('guildMemberRemove', async member => {

	if (member.bot) return

	Event.left(member.id)
})



client.on('guildBanRemove', async (guild, member) => {

	if (member.bot) return

	Event.banRemove(member.id)
})



client.on('guildMemberUpdate', async (guild, member) => {

	if (member.bot) return

	if (member._roles.includes(config.rolePrison)) {

		joinRoleRemove(member.user.id)
	}

	DataBase.member.save(member)
})










client.on('messageReactionAdd', async (reaction, member) => {



	if (member.bot) return



	if (reaction.message.id == config.joinMessage) {

		member = Guild.member.get(member.id)
		if (member) member.roles.add(config.roleJoin)
	}
})



client.on('messageReactionRemove', async (reaction, member) => {



	if (member.bot) return



	if (reaction.message.id == config.joinMessage) {

		member = Guild.member.get(member.id)
		if (member) member.roles.remove(config.roleJoin)
	}
})










client.on('messageDelete', async message => {



	// let logs = await message.guild.fetchAuditLogs({ type: 72 })

	try {

		let count = message.content.split(' ').length

		let member = await Member.get(message.author.id)
		if (member.message > 0) member.message -= 1
		if (member.experience > count - 1) member.experience -= count

	} catch(e) { }
})



client.on('message', async message => {



	if (message.author.bot) return



	/*
		Текстовой канал
	*/

	if (message.channel.type == 'text') {



		Reply(message)



		try {

			let count = message.content.split(' ').length

			let member = await Member.get(message.author.id)
			member.message += 1
			member.experience += count

		} catch(e) { }
	}



	/*
		Приватные сообщения
	*/

	if (message.channel.type == 'dm') {

	}
})










client.on('ready', async () => {

	process.title = client.user.tag



	/*
		TMP
	*/









	/*
		Статус
	*/

	setInterval(function status() {

		(async () => {

			let Online = await Guild.online
			let count = Guild.bot.guild.memberCount - 1

			let online = Online.filter(m => m.status == 'online')
			// let idle = Online.filter(m => m.status == 'idle')
			// let dnd = Online.filter(m => m.status == 'dnd')

			client.user.setPresence({

				activity: {

					type: 'WATCHING',
					name: `   Online ${online.size - 1}      ( ${count} )`
				}
			})

        })()

		return status

	}(), 300000)










	/*
		Сравнение участников сервера из кеша и базы данных
	*/

	var CacheMembers = Guild.member.filter(m => !m.user.bot)
	.map(m => m.user.id)

	var DataBaseMembers = await DataBase.member.all()

	let members = [...new Set(CacheMembers.concat(DataBaseMembers))]

	// участники, которых нет на сервере, но есть в базе - ушли

	members.filter(i => CacheMembers.indexOf(i) < 0)
	.forEach(member => Event.left(member))

	// участники, которых нет в базе данных - новые

	members.filter(i => DataBaseMembers.indexOf(i) < 0)
	.forEach(member => Event.join(member))










	/*
		Создание сообщения для получения роли
	*/

	// получаю канал
	let roleChannel = Guild.channel.get(config.roleChannel)

	// получаю в канале все сообщения
	let roleMessages = await roleChannel.messages.fetch()

	// получаю сообщение для выдачи роли
	let joinMessage = roleMessages.get(config.joinMessage)

	if (joinMessage) {

		let joinMessageReactions = await joinMessage.reactions.resolve('🍌')

		let joinRoleMembers = await joinMessageReactions.users.fetch()
		JoinRoleMembers = joinRoleMembers.filter(m => !m.bot).map(m => m.id)

		CacheMembers.forEach(id => {

			let member = Guild.member.get(id)

			// если реакция на выдачу роли присутствует
			if (JoinRoleMembers.includes(id)) {

				// проверка на блокировку
				if (!member._roles.includes(config.rolePrison)) {

					// выдаю роль, если реакция присутсвтует
					if (!member._roles.includes(config.roleJoin))
					member.roles.add(config.roleJoin)

				} else {

					/*
						если реакция на выдачу роли присутствует,
						но участник заблокирован

						удаляем реакцию заблокированного участника
					*/

					joinRoleRemove(id)
				}



			} else {

				// убираю роль, если реакция отсутсвтует
				if (member._roles.includes(config.roleJoin))
				member.roles.remove(config.roleJoin)
			}
		})

	} else {

		roleChannel.send('` Присоединяйся `').then(m => m.react('🍌'))
	}
})










async function joinRoleRemove(id) {


	// получаю канал
	let roleChannel = Guild.channel.get(config.roleChannel)

	// получаю в канале все сообщения
	let roleMessages = await roleChannel.messages.fetch()

	// получаю сообщение для выдачи роли
	let joinMessage = roleMessages.get(config.joinMessage)

	if (joinMessage) {

		let joinMessageReactions = await joinMessage.reactions.resolve('🍌')
		joinMessageReactions.users.remove(id)
	}
}










/*
	Commands
*/



const Reply = function(message) {



	let prefix = [ `<@!${client.user.id}>`, '<@&778153662798364673>' ]



	prefix.forEach(prefix => {

		if (message.content.startsWith(prefix)) {

			let args = message.content.slice(prefix.length).trim().split(' ')

			// Находим любые цифры
			let id = args.map(a => a.split(/\D/g).join('')).filter(n => n != '').shift()

			// Находим эти цифры без форматирования
			let arg = args.filter(a => a.match(id)).shift()

			// Находим позицию цифр
			let index = args.indexOf(arg)

			// собираем после цифр аргументы ( это текст причины )
			let reason = args.splice(index + 1, args.length).join(' ')

			// аргументы команды
			let commands = args.splice(args.length - index - 1, args.length - 1)


			let fuckyou = [

				'А чё ты ещё хочешь?',
				'А нахуй бы тебе не пойти?',
				'А хуй тебе',
				'Да чёт мне лень',
				'У тебя ещё банилка не выросла',
				'Любой каприз за ваш сасай',
				'Баны отключены за неуплату',
				'Ты кто блять?'

			].random


			let notexist = [

				'Не могу найти такого участника',
				'Такого участника нет',
				'Я тупенькая и найти такого участника не могу',
				'Не знаю кто это',
				'А это кто?'

			].random


			commands.forEach(command => {



				if (['бан', 'бань', 'забань', 'заблокировать', 'заблокируй', 'забанить', 'блок']
				.includes(command.toLowerCase())) {

					message.member.hasPermission('KICK_MEMBERS') ?
					Jail(message, id, reason, notexist) : message.reply(fuckyou)
				}



				if (['разбан', 'разбань', 'разбанить', 'разблокировать', 'разблокируй']
				.includes(command.toLowerCase())) {

					message.member.hasPermission('KICK_MEMBERS') ?
					unJail(message, id, notexist) : message.reply(fuckyou)
				}
			})
		}
	})
}



async function Jail(message, id, reason, notexist) {



	let member = await Guild.member.get(id)
	let _member = await Member.get(id)

	if (!_member)
	return message.reply(notexist)

	Event.Jail(message.author, _member, reason)

	_member.ban = message.author.id
	_member.reason = reason

	// если участник на сервере - убрать все роли

	if (member) {

		member.roles.add(config.rolePrison)

		let roles = member._roles
		let index = roles.indexOf(config.rolePrison)
		roles.splice(index, 1)

		roles.forEach(role => member.roles.remove(role))
	}
}



async function unJail(message, id, notexist) {



	let member = await Guild.member.get(id)
	let _member = await Member.get(id)

	if (!_member)
	return message.reply(notexist)

	Event.unJail(message.author, _member)

	_member.ban = null
	_member.reason = null

	// если участник на сервере - вернуть все роли

	if (member) {

		member.roles.remove(config.rolePrison)

		let roles = JSON.parse(_member.roles)
		if (roles) {

			let index = roles.indexOf(config.roleJoin)
			roles.splice(index, 1)

			roles.forEach(role => member.roles.add(role))
		}
	}
}



client.login(config.token)
