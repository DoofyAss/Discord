


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



		let member = Guild.member.get(id)
		let comeback = await DataBase.member.sync(member)



		if (comeback) {

			if (lib.random(100) > 10) {

				let replys = [

					'Ну и где это мы были?',
					'Тебя не ждали.',
					'Без тебя было лучше.',
					'Даже знать не хочу где тебя носило...',
					'Ухади ацуда!',
					'Тебе здесь не рады.',
					'И зачем надо было выходить?',
					'Выйди и зайди нормально.',
					'От тебя гавной воняет, даже отсюда, телефона чувствую.',
					'Можешь уходить обратно, я тебя больше не люблю 💔'
				]

				Guild.channel.get(channel.notify)
				.send(`<@${member.user.id}> ${replys.random}`)
			}
		}



		Guild.channel.get(channel.notify)
		.send(this.embed({

			id: member.user.id,
			name: member.user.username,
			avatar: member.user.avatar,
			text: comeback ? 'Возвращается' : 'Присоединяется',
			color: comeback ? null : 0x7289da

		})).then(m => {

			if (!comeback) m.react('👋')
		})
	},



	left: async function(id) {



		let Bans = await Guild.cache.fetchBans()
		let ban = Bans.get(id)



		let member = await Member.get(id)
		member.leftDate = Date.now()



		if (ban)
		Guild.channel.get(channel.notify)
		.send({ embed: {

			color: 0xdd2e44,
			author: {

				name: member.name,
				icon_url: member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : null
			},
			description: ban.reason ? `Заблокирован. \ \ Причина: \ \ ${ban.reason}` : 'Заблокирован'
		}})



		if (!ban)
		Guild.channel.get(channel.notify)
		.send(this.embed({

			id: member.id,
			name: member.name,
			avatar: member.avatar,
			text: 'Уходит'

		}))
	},



	unban: async function(id) {

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
client.on('guildBanRemove', async (guild, member) => Event.unban(member.id))



client.on('guildMemberUpdate', async (guild, member) => DataBase.member.save(member))



client.on('ready', async () => {

	process.title = client.user.tag



	/*
		TMP
	*/



	// Event.joinMember('270862586688307200')
	// Event.unban('371199971099410435', '400558737376411656')



	/*
		Статус
	*/

	setInterval(function status() {

		let countMembers = Guild.bot.guild.memberCount - 1
		let onlineMembers = Guild.bot.guild.presences.cache.size - 1

		client.user.setPresence({

			activity: {

				type: 'WATCHING',
				name: `  Online ${onlineMembers}    ( ${countMembers} )`
			}
		})

		return status

	}(), 180000)



	/*
		Сравнение участников сервера из базы и кеша
	*/

	let CacheMembers = Guild.member.map(member => member.user)
	.filter(member => member.bot == false).map(member => member.id)

	let DataBaseMembers = await DataBase.member.all()

	let members = [...new Set(CacheMembers.concat(DataBaseMembers))]

	// участники, которых нет на сервере, но есть в базе - ушли

	members.filter(i => CacheMembers.indexOf(i) < 0)
	.forEach(member => Event.left(member))

	// участники, которых нет в базе данных - новые

	members.filter(i => DataBaseMembers.indexOf(i) < 0)
	.forEach(member => Event.join(member))
})



client.login(config.token)
