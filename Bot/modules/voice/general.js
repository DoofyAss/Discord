


global.General = {

	timer: Timer({ id: 'GeneralVoiceUpdate' }),

	task(left, join) {

		let a = left ?. parentId == config.category.general
		let b = join ?. parentId == config.category.general

		if (a || b) this.timer.restart(2000, () => this.update())
	},



	async update() {

		let channels = this.channels.sort((a, b) => b.members.size ? 1 : -1)

		let visible = channels.array.filter(c => c.members.size)
		let invisible = channels.array.filter(c => ! c.members.size)



		let last = invisible.pop()

		if (last) {

			await this.edit(last)
			await last.edit({ position: visible.length })
		}



		for (channel of channels.array)
		if (channel.members.size == 0) {

			channel.statusName = null

			if (channel.name != 'канал')
			await channel.edit({ name: 'канал' })
		}

		for (channel of invisible)
		await this.edit(channel, false)

		for (channel of visible)
		await this.edit(channel, true)

		for (channel of visible)
		await this.status(channel.id)
	},



	async status(channel_id) {

		let channel = client.guild.channels.cache.get(channel_id)

		let status = []



		let males = channel.members.filter(m =>
		m._roles.includes(config.roles.male)).size

		if (males) status.push(`${ males } <:xy:1221260906827087953>`)

		let females = channel.members.filter(m =>
		m._roles.includes(config.roles.female)).size

		if (females) status.push(`${ females } <:xx:1221260896463093861>`)



		let admins = channel.members.filter(m =>
		m._roles.includes(config.roles.Admin)).size

		let moderators = channel.members.filter(m =>
		m._roles.includes(config.roles.Moderator)).size

		let developers = channel.members.filter(m =>
		m._roles.includes(config.roles.Developer)).size



		let homies = channel.members.filter(m =>
		m._roles.includes(config.roles.homie)).size

		if (homies) {

			let black = channel.members.find(m => m.id == '969978235116978316')
			let murmurr = channel.members.find(m => m.id == '261499774740594696')

			black && murmurr && channel.members.size == 2 ?
			status.push(`<a:hearts_red:1238059305949986817>`) :

			status.push(`<:homie:1226447390102523925>`)
		}



		// let boosters = channel.members.filter(m =>
		// m._roles.includes(config.roles.booster)).size

		// if (boosters) status.push(`${ boosters } <:role_Booster:1043345216922472539>`)

		// let bananas = channel.members.filter(m =>
		// m._roles.includes(config.roles.banana)).size

		// if (bananas) status.push(`${ bananas } <:role_Banana:1043345228737814630>`)



		let statusName = status.join(' ')

		if (channel.members.size)
		if (channel.statusName != statusName) {

			channel.statusName = statusName
			await channel.status(statusName)
		}
	},



	hide: new Discord.PermissionsBitField(0n),
	show: new Discord.PermissionsBitField(1024n),



	async edit(channel, view = true, update = false) {

		let permissions = channel.permissionOverwrites.cache

		let male = permissions.get(config.roles.male)
		let female = permissions.get(config.roles.female)



		let mbit = male.allow.bitfield & 1024n
		let fbit = female.allow.bitfield & 1024n



		if (! view && [ mbit, fbit ].some(Boolean)) {

			male.allow = female.allow = this.hide
			update = true
		}



		if (view && ! [ mbit, fbit ].every(Boolean)) {

			male.allow = female.allow = this.show
			update = true
		}



		update && await channel.permissionOverwrites
		.set(permissions.array).catch(e => undefined)
	},



	get bitrate() {

		switch (client.guild.premiumTier) {

			case 0: return 96000
			case 1: return 128000
			case 2: return 256000
			case 3: return 384000
		}
	},



	get channels() {

		return client.guild.channels.cache
		.filter(c => c.type == 2) // voice channels
		.filter(c => c.parentId == config.category.general)
	},



	num: 8,

	async init() {

		for (let i = this.channels.size; i < this.num; i++) {

			await client.guild.channels.create({

				type: 2,
				name: 'канал',
				bitrate: this.bitrate,
				parent: config.category.general
			})
		}

		this.update()
	},



	async updatePermissions() {

		let category = client.guild.channels.cache.get(config.category.general)

		let permissions = category.permissionOverwrites.cache.array

		let channels = client.guild.channels.cache.array
		.filter(c => c.parentId == config.category.general)

		for (channel of channels) {

			await channel.permissionOverwrites
			.set(permissions).catch(e => undefined)
		}

		await this.update()
	},



	async deleteChannels() {

		let channels = client.guild.channels.cache
		.filter(channel => channel.parentId == config.category.general).array

		for (channel of channels)
		await channel.delete()
	}
}



client.on('ready', () => General.init())
client.on('voiceAny', ({ left, join }) => General.task(left, join))
