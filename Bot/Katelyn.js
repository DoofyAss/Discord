


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



	joinMember: function(id) {

		let member = Guild.member.get(id)
		DataBase.member.sync(member)

		console.log(`joined ${member.user.username}#${member.user.discriminator}`)
	},



	leftMember: async function(id) {

		let member = await Member.get(id)
		member.leftDate = Date.now()

		console.log(`left ${member.name}#${member.discriminator}`)
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

// Member.get('270862586688307200', member => member.experience += 20)














client.on('guildMemberAdd', async member => Event.joinMember(member.id))
client.on('guildMemberRemove', async member => Event.leftMember(member.id))



client.on('guildMemberUpdate', async (guild, member) => {

	DataBase.member.save(member)
})



client.on('ready', async () => {

	process.title = client.user.tag


	
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
	.forEach(member => Event.leftMember(member))

	// участники, которых нет в базе данных - новые

	members.filter(i => DataBaseMembers.indexOf(i) < 0)
	.forEach(member => Event.joinMember(member))
})

client.login(config.token)
