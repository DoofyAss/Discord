


const { lib } = require('./lib/lib.js')
const { DataBase, DB } = require('./DataBase')
const { Command } = require('./Command')
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



	embed: function(data) {

		return { embed: {

			color: data.color,
			author: {

				name: data.name,
				icon_url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=64` : null
			},
			description: data.text
        }}
    },



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
		joinRoleRemove(id)



		if (ban) Guild.channel.get(channel.notify).send({ embed: {

			color: 0xdd2e44,
			author: {

				name: member.name,
				icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
			},
			description: ban.reason ? `Заблокирован. \ \ Причина: \ \ ${ban.reason}` : 'Заблокирован'
		}})



		if (!ban) Guild.channel.get(channel.notify).send(this.embed({

			id: member.id,
			name: member.name,
			avatar: member.avatar,
			text: 'Уходит'

		}))
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














client.on('guildMemberAdd', async member => Event.join(member.id))
client.on('guildMemberRemove', async member => Event.left(member.id))
client.on('guildBanRemove', async (guild, member) => Event.banRemove(member.id))

client.on('guildMemberUpdate', async (guild, member) => {

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



		// console.log(message.content)



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



async function Prison(by, id, reason) {



	let member = await Guild.member.get(id)
	let _member = await Member.get(id)

	_member.ban = by
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



async function UnPrison(by, id) {



	let member = await Guild.member.get(id)
	let _member = await Member.get(id)

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
