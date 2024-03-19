


require('./DataBase').init()



$(client)



.add(async function member(id) {

	let cache = this.guild.members.cache.get(id) ||
	await this.guild.members.fetch({ user: id }).catch(() => undefined)

	let data = await DataBase.member.fetch(id)

	return new Member(id, data, cache)
})










class Member {



	constructor(id, data, cache) {

		this.id = id
		this.data = data
		this.cache = cache
	}










	hasRole(id) {

		return this.cache._roles.includes(id)
	}










	get globalname() {

		let cache = this.cache ?. user ?. globalName
		let data = this.data ?. globalname

		return cache || data
	}










	get username() {

		let cache = this.cache ?. user ?. username
		let data = this.data ?. username

		return cache || data
	}










	get newbie() {

		let term = 604800000 // 7 day msec

		let data = this.data ?. join * 1000
		let cache = this.cache ?. joinedTimestamp

		let since = data || cache

		let timestamp = parseInt(since) + parseInt(term)
		return timestamp.past ? false : timestamp
	}










	async save() {

		let data = {

			id: this.id,
			username: this.username,
			globalname: this.globalname
		}



		if (! this.data)
		data.join = parseInt(this.cache.joinedTimestamp / 1000)



		await DataBase.member.insert(data)
	}
}










client.on('guildMemberVerify', async id => {

	let member = await client.member(id)

	await member.save()
})










client.on('ready', async () => {

	let newbie = config.roles.newbie



	let cache_newbies = client.guild.roles.cache
	.get(config.roles.newbie).members.map(e => e.user.id)

	let data_newbies = await DataBase.member.newbies

	let newbies = new Set([...cache_newbies, ...data_newbies])



	for (id of newbies) {

		let member = await client.member(id)

		if (! member.data)
		await member.save()

		if (! member.hasRole(newbie) && member.newbie)
		member.cache.roles.add(newbie)

		if (! member.newbie && member.hasRole(newbie))
		member.cache.roles.remove(newbie)
	}
})
