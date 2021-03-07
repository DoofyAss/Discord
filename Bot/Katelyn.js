


const { lib } = require('./lib/lib.js')
const { DataBase, DB } = require('./DataBase')
const { server, channel, role, config } = require('./config')

const { Client } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

const ytdl = require('ytdl-core')










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



	get role() {

		return this.cache.roles.cache
	},



	members: async function() {

		let cache = await this.cache.members.fetch({ cache: false })
		let members = cache.filter(member => !member.user.bot)

		let online = members.filter(member => member.presence.status != 'offline')
		let offline = members.filter(member => member.presence.status == 'offline')

		return {

			count: {

				all: members.size,
				online: online.size,
				offline: offline.size,
			},

			online: online,
			offline: offline
		}
	},



	get emoji() {

		return this.cache.emojis.cache
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

				/*if (parseInt(member.leftDate) + 86400000 < Date.now()) {

					let replys = [

						'Ну и где это мы были?',
						'Выйди и зайди нормально.',
						'И зачем надо было выходить?',
						'Даже знать не хочу где тебя носило...',
						'Можешь уходить обратно, я тебя больше не люблю 💔'
					]

					notify.send(`<@${id}> ${replys.random}`)
				}*/
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
	},










	roleOfDay: async function(Online) {

		// Получаем всех участников с временной ролью

		let members = await DataBase.roleOfDay()



		members.forEach(async member => {

			// console.log(`[${Date.now().time}]`, `[${member.id}]`, member.name, Online.has(member.id) ? 'online' : 'offline')

			/*
				Убираю роль, если дата из базы меньше текущей или участник не в сети
			*/

			if (member.roleDate < Date.now() || !Online.has(member.id)) {

				// Если участник на сервере

				let memberGuild = Guild.member.get(member.id)
				let memberDataBase = await Member.get(member.id)

				if (memberGuild) {

					memberGuild.roles.remove(config.roleOfDay)

				} else {

					// Если участник покинул сервер
					// Получаю все роли, кроме временной

					let roles = JSON.parse(memberDataBase.roles)
					let index = roles.indexOf(config.roleOfDay)
					if (index > -1) roles.splice(index, 1)

					// Возвращаю все роли, кроме временной

					member.roles = JSON.stringify(roles)
				}

				memberDataBase.roleDate = null

				/*Guild.role.get(config.roleOfDay).edit({
					name: config.roleOfDayName
				})*/

			}/* else {

				// Если время ещё не вышло, определяем сколько осталось

				Guild.role.get(config.roleOfDay).edit({
					name: `${config.roleOfDayName} \ - \ ${(member.roleDate - Date.now()).became}`
				})
			}*/

		})



		// Если нет участников с временной ролью

		if (!members.length) {

			let id = Online.map(member => member.user.id).random

			// if (['371199971099410435', '270862586688307200'].includes(id)) return console.log('dont give role', id)

			this.giveRoleOfDay(id)
		}
	},



	giveRoleOfDay: async function(id) {



		let _member = Guild.member.get(id)
		let member = await Member.get(id)

		if (member) {

			if (!member.ban) {



				member.roleDate = Date.now() + 43200000

				if (!_member._roles.includes(config.roleOfDay))
				await _member.roles.add(config.roleOfDay)



				/*Guild.channel.get(channel.chat)
				.send({ embed: {

					color: _member.displayHexColor.replace('#000000', null),
					description: 'Тухлое яйко дня',
					author: {

						name: _member.displayName,
						icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
					}

				}}).then(m => m.react('💛'))*/
			}
		}
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

	if (member.user.bot) return

	Event.join(member.id)
})



client.on('guildMemberRemove', async member => {

	if (member.user.bot) return

	Event.left(member.id)
})



client.on('guildBanRemove', async (guild, member) => {

	if (member.user.bot) return

	Event.banRemove(member.id)
})



client.on('guildMemberUpdate', async (guild, member) => {

	if (member.user.bot) return



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

	try {

		let count = message.content.split(' ').length

		let member = await Member.get(message.author.id)
		if (member.message > 0) member.message -= 1
		if (member.experience > count - 1) member.experience -= count

	} catch(e) { }
})










client.on('message', async message => {


	if (message.author.bot) return

	console.log(`[ ${Date.now().time} ] ${message.author.username}: ${message.content}`)










	/*
		Текстовой канал
	*/

	if (message.channel.type == 'text') {



		if (message.content.startsWith('!'))
		return Command.try(message)



		Antispam.try(message)



		Reply(message)
		Pidor.try(message)



		if (message.channel.id == '780723548981166140') { // bin

		}



		if ([

			'786423732151123988', // cyberpunk
			'816605463541973014', // 18

		].includes(message.channel.id)) {

			let attachments = message.attachments.map(a => a.attachment)

			if (attachments.length) {

				message.react('💛')

			} else {

				message.delete()
			}
		}



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



	/*
		TMP
	*/

	/*setInterval(function interval() {

		(async () => {



        })()

		return interval

	}(), 100000)*/










	/*
		Статус
	*/

	setInterval(function status() {

		(async () => {



			let Members = await Guild.members()
			let online = Members.online.filter(m => m.presence.status == 'online')



			client.user.setPresence({

				activity: {

					type: 'WATCHING',
					name: ` \u200B Online ${ online.size } \u200B ( ${ Members.count.all + 1 } )`
				}
			})



			Event.roleOfDay(Members.online)

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

		// joinMessage.edit('` Для полного доступа жми на банан `')

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

		roleChannel.send('` Для полного доступа жми на банан `').then(m => m.react('🍌'))
	}



	process.title = client.user.tag
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
	Reply
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

			commands.forEach(command => {



				if (['бан', 'бань', 'забань', 'заблокировать', 'заблокируй', 'забанить', 'блок']
				.includes(command.toLowerCase())) {

					Command.jail(message, id, reason, true)
				}



				if (['разбан', 'разбань', 'разбанить', 'разблокировать', 'разблокируй']
				.includes(command.toLowerCase())) {

					Command.unjail(message, id, true)
				}
			})
		}
	})
}










/*
	Antispam
*/

const Antispam = {

	collection: {},

	try: async function(message) {



		let id = message.id
		let author = message.author.id



		if (this.ohyelLevel[author] == 3) {

			if (message.content.toLowerCase().match(/извините|извини|извени|сорян|сори|прощение|извиняюсь|sorry|прости|простите/ug)) {

				delete this.ohyelLevel[author]

			} else {

				if (!message.deleted) message.delete()
			}

			return
		}



		if (!this.collection.hasOwnProperty(author))
		this.collection[author] = []

		this.collection[author].push(message)

		if (this.collection[author].length > 2) {
			this.collection[author].forEach(message => { message.del = true })
		}



		setTimeout(() => {

			let index = this.collection[author].map(m => m.id).indexOf(id)

			let message = this.collection[author][index]
			let length = this.collection[author].length

			if (message.del) {

				if (length < 2) this.ohyel(message)
				if (!message.deleted) message.delete()
			}

			if (index > -1) this.collection[author].splice(index, 1)

		}, 1500)
	},



	ohyelLevel: {},

	get replys() {

		return [

			'тебе въебать?',
			'охуеваешь на глазах',
			'последствий хочешь?',
			'последнее предупреждение',
			'а жареных гвоздей не хочешь?'

		].random
	},

	ohyel: async function(message) {



		let author = message.author.id



		if (this.ohyelLevel[author] == 2) {

			message.reply('буду удалять все твои сообщения, пока не извинишься')
			this.ohyelLevel[author] = 3
		}

		if (this.ohyelLevel[author] == 1) {

			message.reply(this.replys)
			this.ohyelLevel[author] = 2
		}

		if (!this.ohyelLevel[author]) {

			message.reply('не спамь!').then(m => m.delete({ timeout: 5000 }))
			this.ohyelLevel[author] = 1
		}
	}
}










/*
	Command
*/

const Command = {



	try: async function(message) {

		this.message = message
		message.delete()

		this.args = message.content.slice(1).trim().split(' ')
		let cmd = this.args.shift().toLowerCase()

		if (Command[cmd]) Command[cmd]()
	},



	egg: async function() {

		let members = await DataBase.roleOfDay()

		members.forEach(async member => {

			let _member = await Guild.member.get(member.id)

			if (_member)
			this.message.channel.send({

				embed: {

					color: _member.displayHexColor,
					description: `<@!${member.id}> \ \ до истечения роли осталось: \ \ ${(member.roleDate - Date.now()).became}`
				}
			})
		})
	},



	info: async function() {



		let id = this.args.shift()
		id = id ? id.split(/\D/g).join('') : this.message.author.id



		let events = await DataBase.member.events(id)
		if (!events) return

		let nicknames = events
		.filter(e => e.nick != null)
		.map(e => e.nick)

		nicknames = [...new Set(nicknames)].join('\n')

		let usernames = events
		.filter(e => e.name != null)
		.map(e => `${e.name}#${e.discriminator}`)

		usernames = [...new Set(usernames)].join('\n')

		// server member

		let member = Guild.member.get(id)
		if (member) {

			this.message.channel.send({ embed: {

				color: member.displayHexColor == '#000000' ? null : member.displayHexColor,
				author: {

					name: `${member.displayName}`,
					icon_url: member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=64` : null
				},
				fields: [
					{
						name: 'Имена',
						value: usernames ? usernames : '[отсутствуют]',
						inline: true
					},
					{
						name: '\u200B',
						value: '\u200B',
						inline: true
					},
					{
						name: '\u200B',
						value: nicknames ? nicknames : '[отсутствуют]',
						inline: true
					},
					{
						name: 'Дата присоединения',
						value: member.joinedTimestamp.date,
						inline: true
					}

				],
				footer: {

					// text: member.user.avatar ? `[аватар](https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png)` : null
				},
				description: member.user.avatar ? `[аватар](https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=1024)` : null
			} })

		} else {

			// database member

			let _member = await Member.get(id)
			if (!_member) return

			this.message.channel.send({ embed: {

				author: {

					name: `${_member.name}#${_member.discriminator}`,
					icon_url: _member.avatar ? `https://cdn.discordapp.com/avatars/${_member.id}/${_member.avatar}.png?size=64` : null
				},
				footer: {

					text: `Дата присоединения \ \ ${_member.joinDate.date}`
				},
				description: nicknames
			} })
		}
	},



	say: function() {

		if (!this.message.member.hasPermission('KICK_MEMBERS')) return

		let content = this.args.join(' ')
		this.message.channel.send(content)
	},



	react: async function() {

		if (!this.message.member.hasPermission('KICK_MEMBERS')) return

		let id = this.args.shift()
		let emoji = this.args.shift()

		try {

			let message = await this.message.channel.messages.fetch(id)
			if (message) {

				message.react(emoji)
			}

		} catch { }
	},



	clear: async function() {

		if (!this.message.member.hasPermission('KICK_MEMBERS')) return

		let id = this.args.join('')

		try {

			let message = await this.message.channel.messages.fetch(id)
			if (message) {

				await message.reactions.removeAll()
			}

		} catch { }
	},



	c: async function() {

		if (!this.message.member.hasPermission('MANAGE_MESSAGES')) return

		await new Promise(resolve => setTimeout(resolve, 2000))


		let lastMessages = await this.message.channel.messages.fetch({ limit: 50, cache: false })



		// clear member messages

		if (this.args.length == 2) {



			let id = this.args.shift()
			let count = this.args.shift()

			id = id ? id.split(/\D/g).join('') : null



			let messages = []
			lastMessages.filter(m => m.author.id == id)
			.forEach(m => messages.length < count ? messages.push(m) : null)

			messages.forEach(m => { if (!m.deleted) m.delete() })
		}

		// clear last messages

		if (this.args.length == 1) {

			let count = this.args.shift()

			let messages = []
			lastMessages.forEach(m => messages.length < count ? messages.push(m) : null)

			messages.forEach(m => { if (!m.deleted) m.delete() })
		}
	},










	/*
		Jail
	*/



	get notexist() {

		return [

			'А это кто?',
			'Не знаю кто это',
			'Такого участника нет',
			'Не могу найти такого участника',
			'Я тупенькая и найти такого участника не могу'

		].random
	},



	get cantjail() {

		return [

			'Ухади',
			'Не буду',
			'Не будь какашкой',
			'Ты меня не заставишь',
			'Я не могу этого сделать',
			'Я не могу так поступить',
			'Сейчас довыёбываешься и я заблокирую тебя'

		].random
	},



	get fuckyou() {

		return [

			'А хуй тебе',
			'Ты кто блять?',
			'Да чёт мне лень',
			'А чё ты ещё хочешь?',
			'Любой каприз за ваш сасай',
			'А нахуй бы тебе не пойти?',
			'Баны отключены за неуплату',
			'У тебя ещё банилка не выросла'

		].random
	},



	jail: async function(message, id, reason, reply) {

		if (!arguments.length) return

		if (!message.member.hasPermission('KICK_MEMBERS'))
		return reply ? message.reply(this.fuckyou) : null

		let member = await Guild.member.get(id)
		let _member = await Member.get(id)

		if (member) {

			if (member.hasPermission('KICK_MEMBERS')) {

				return reply ? message.reply(this.cantjail) : null
			}
		}

		if (!_member)
		return reply ? message.reply(this.notexist) : null



		if (!_member.ban) {

			// Если блокировки нет - выдаю

			_member.ban = message.author.id
			_member.reason = reason

			joinRoleRemove(id)

			Event.Jail(message.author, _member, reason)

		} else {

			// Если уже заблокирован - выдаю сообщение кто заблокировал

			let executor = await Member.get(_member.ban)

			if (executor) {

				if (_member.reason) {

					message.channel.send(`<@!${_member.id}> уже был заблокирован. <@!${executor.id}> ( ${ _member.reason } )`)

				} else {

					message.channel.send(`<@!${_member.id}> уже был заблокирован. <@!${executor.id}>`)
				}


			} else {

				message.channel.send(`<@!${_member.id}> уже был заблокирован.`)
			}
		}



		// если участник на сервере - убрать все роли

		if (member) {

			member.roles.add(config.rolePrison)

			let roles = member._roles
			let index = roles.indexOf(config.rolePrison)
			roles.splice(index, 1)

			roles.forEach(r => member.roles.remove(r))
		}
	},



	unjail: async function(message, id, reply) {

		if (!arguments.length) return

		if (!message.member.hasPermission('KICK_MEMBERS'))
		return reply ? message.reply(this.fuckyou) : null

		let member = await Guild.member.get(id)
		let _member = await Member.get(id)

		if (!_member)
		return reply ? message.reply(this.notexist) : null



		// Если участник заблокирован - снимаю блокировку

		if (_member.ban) {

			_member.ban = null
			_member.reason = null

			Event.unJail(message.author, _member)

		} else {

			message.channel.send(`<@!${_member.id}> не был заблокирован.`)
		}



		// если участник на сервере - вернуть все роли

		if (member) {

			member.roles.remove(config.rolePrison)

			let roles = JSON.parse(_member.roles)
			if (roles) {

				let index = roles.indexOf(config.roleJoin)
				roles.splice(index, 1)

				roles.forEach(r => member.roles.add(r))
			}
		}
	},



	ban: async function() {

		let id = this.args.shift()
		id = id ? id.split(/\D/g).join('') : null

		let reason = this.args.join(' ')

		if (id) this.jail(this.message, id, reason)
	},



	unban: async function() {

		let id = this.args.shift()
		id = id ? id.split(/\D/g).join('') : null

		if (id) this.unjail(this.message, id)
	}
}










/*
	Pidor
*/

const Az = require('az')

let Pidor = {



	await: false,
	timer: function() {

		Pidor.await = !Pidor.await
		return this.timer
	},



	canSorry: false,
	canSorryTimer: null,
	timerSorry: function() {

		Pidor.canSorry = !Pidor.canSorry
		return this.timerSorry
	},



	whoPidor: false,
	timerWhoPidor: function() {

		Pidor.whoPidor = !Pidor.whoPidor
		return this.timerWhoPidor
	},



	awaitAnime: false,
	timerAnime: function() {

		Pidor.awaitAnime = !Pidor.awaitAnime
		return this.timerAnime
	},



	message: null,
	content: null,



	try: function(message) {



		this.message = message
		this.content = message.content.toLowerCase().replace('ё', 'е')



		if (this.content.match(/тупой бот|ебаный бот|бот ебаный|ебучий бот|бот ебучий/ug))
		if (this.stupid()) return



		if (this.content.match(/кто пидорас|кто пидарас/ug))
		if (this.whopidor()) return



		if (this.content.match(/кто пидор|кто пидар|кто педик/ug))
		if (this.whopidor(true)) return



		if (this.content.match(/бот извинись|извинись бот|извинись/ug))
		if (this.sorry()) return



		if (this.content.match(/аниме|анимэ|anime/ug))
		if (this.anime()) return



		if (this.content.match(/[\w+]* для пидоров|[\w+]* для пидарасов|жопотрах|гей|педик|пидор|пидрила|пидарюга|гомосек|гомик|глиномес|говномес|голубой|гомодрил|лезбиянка|лезбуха|лезба/ug))
		this.message.react(['🏳️‍🌈', '🌈'].random)



		if (this.content.match(/петух|курица/ug))
		this.message.react('🐓')



		if (this.content.match(/шоколад|шоколадный|негр|негритос|уголек|негативчик|черный|черномазый|черножопый|эфиоп|сникерс/ug))
		this.message.react(['🐵', '🙉', '🙊', '🙈'].random)



		if (lib.random(100) < 3) this.for()
	},



	stupid: function() {



		if (this.canSorry) return false
		this.canSorryTimer = setTimeout(this.timerSorry(), 60000)



		this.message.reply([

			'Кожаные ублюдки',
			'Ой да иди нахуй!',
			'Я твой рот ебала',
			'Хркъ, тьфу!',
			'А хули нам, ботам',
			'Are you ахуел?'

		].random)

		return true
	},



	whopidor: async function(off) {


		if (this.await) return false
		setTimeout(this.timer(), 1000)

		// if (this.canSorry) return false
		// this.canSorryTimer = setTimeout(this.timerSorry(), 60000)



		// if (['371199971099410435', '270862586688307200'].includes(this.message.author.id)) {
		if (this.message.member.hasPermission('KICK_MEMBERS')) {

			let Members = await Guild.members()

			var id = off ?
			Members.offline.map(member => member.user.id).random :
			Members.online.map(member => member.user.id).random

		} else {

			var id = this.message.author.id
		}

		this.message.channel.send(`<@!${id}> Ты пидорас!`)
		this.message.channel.send('<:emoji:781540642941435905>')



		return true
	},



	sorry: function() {



		if (!this.canSorry) return false

		clearTimeout(this.canSorryTimer)
		this.canSorry = false


		let negative = [

			':stuck_out_tongue_closed_eyes:',
			':rolling_eyes:',
			':confused:',
			':smirk:',
			':angry:',
			':rage:'

		].random

		let positive = [

			':smiling_face_with_3_hearts:',
			':pleading_face:',
			':head_bandage:',
			':relieved:',
			':wink:',
			':nerd:'

		].random

		this.message.channel.send(lib.random(100) < 75 ? `Извините ${positive}` : `Не буду ${negative}`)

		return true
	},



	anime: async function() {


		if (this.awaitAnime) return false
		setTimeout(this.timerAnime(), 60000)

		this.message.channel.send([

			'Почему воняет пердой?',
			'Несёт прям как с канализации...',
			'Чё говном воняет?',
			'Чувствуете? Запах какашек 🤮',
			'Ну и вонища тут у вас 🤢',
			'Я тут накакала, уберите кто-нибудь 💩'

		].random)

		return true
	},



	for: async function() {



		if (this.await) return
		setTimeout(this.timer(), 60000)



		let word = await this.noun()

		if (typeof word != 'undefined')
		this.message.reply(`${word} для пидоров`).then(m => m.react('🏳️‍🌈'))
	},



	noun: async function() {



		let morph = await Promise.all(

			this.content.replace(/[^a-zа-я0-9\s]+/g, '').split(' ').map(word => {

				return new Promise(result => {

					Az.Morph.init(() => result( Az.Morph(word).shift() ) )
				})
			})
		)



		try {

			let words = morph.filter(morph => morph.tag.POST == 'NOUN').map(morph => morph.word)
			return words.random

		} catch { }
	}
}



client.login(config.token)
