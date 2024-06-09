


const Role = {



	list: [

		{ level: 1, id: '988281449226579969', emoji: '1043344930145325086' }, // admin
		{ level: 2, id: '1014239457030983771', emoji: '1043344919646982165' }, // moderator
		{ level: 3, id: '1014240290623733890', emoji: '1043344907592536125' }, // support
		{ level: 4, id: '1015475082832920576', emoji: '1043344873002123285' }, // media
		{ level: 4, id: '1014241133733367888', emoji: '1043344857730658354' }, // event
		{ level: 4, id: '1014913737314013274', emoji: '1043344781847298198' }, // helper
		{ level: 0, id: '975550957242970112', emoji: '1043344741812670515' }, // developer
		{ level: 4, id: '995013512780853399', emoji: '1043345205019021422' }, // homie
		{ level: 1, id: '1002482498099490927', emoji: '1043345228737814630' }, // banana
	],



	level(member) {

		return this.list.reduce((level, role) => {

			if (role.level < level)
			if (member._roles.includes(role.id)) level = role.level

			return level

		}, 4)
	},



	async change_sex(member) {

		let male = config.roles.male
		let female = config.roles.female

		let sex = member._roles.includes(male)

		let roles = member._roles.filter(r => ! [ male, female ].includes(r))

		sex ? roles.push(female) : roles.push(male)

		await member.roles.set(roles)
	},



	async data(a) {



		if (! a.member) {

			let member_id = a.interaction.message.content.replace(/[^0-9]/g, '')
			a.member = client.guild.members.cache.get(member_id)

			if (! a.button)
			a.update = true
		}



		let authorLevel = this.level(a.interaction.member)
		let memberLevel = this.level(a.member)



		// Level

		if (memberLevel <= authorLevel || a.member.user.bot) {

			data = {

				ephemeral: true,
				embeds: [{

					color: color.red,
					description: `Невозможно управлять \u200b ${ emoji.sad } \u200b <@${ a.member.id }>`
				}]
			}

			return a.update || a.button ?
			await a.interaction.update(data) :
			await a.interaction.reply(data)
		}



		if (a.update) {

			let roles = this.list.filter(r => memberLevel <= r.level).map(r => r.id)

			let memberRoles = a.member._roles
			.filter(r => ! roles.includes(r))
			.concat(a.interaction.values)

			await a.member.roles.set(memberRoles)
		}



		// List

		let options = Role.list.map(item => {

			if (role = client.guild.roles.cache.get(item.id))
			if (item.level > authorLevel)
			return {

				label: role.name,
				value: role.id,
				description: item.description,
				emoji: item.emoji,
				default: Boolean(a.member._roles.includes(role.id))
			}

		}).filter(e => e)



		let components = [{

			type: 1,
			components: [{

				type: 3,
				custom_id: 'select_role',
				placeholder: 'Роли',
				min_values: 0,
				max_values: options.length,
				options: options
			}]
		}]



		// Sex

		if (a.button == 'update_sex')
		await this.change_sex(a.member)

		let sex = a.member._roles.includes(config.roles.female)

		components.push({

			type: 1,
			components: [{

				type: 2,
				style: 2,
				label: '\u200b \u200b Сменить',
				custom_id: 'update_sex',
				emoji: sex ? '1221259929428561991' : '1221259930829459619'
			}]
		})



		data = {

			ephemeral: true,
			content: `<@${ a.member.user.id }>`,
			components: components
		}

		return a.update || a.button ?
		await a.interaction.update(data) :
		await a.interaction.reply(data)
	}
}










application.components.push({

	name: 'select_role',
	cooldown: { time: 3000, member: new Map },

	async run() {

		await Role.data({ interaction: this.interaction })
	}
})










application.components.push({

	name: 'update_sex',
	cooldown: { time: 3000, member: new Map },

	async run() {

		await Role.data({ interaction: this.interaction, button: 'update_sex' })
	}
})










module.exports = [

{
	name: 'роли',
	description: '⚡ управление ролями',
	cooldown: { time: 3000, member: new Map },
	allow: [

		config.roles.Admin,
		config.roles.Moderator,
		config.roles.Support,
		config.roles.Developer
	],

	options: [

		{
			name: 'member',
			description: 'участник сервера',
			type: 6, // MEMBER
			required: true
		}
	],



	async run() {

		let member = this.option.message ?. member || this.option.member

		await Role.data({ interaction: this.interaction, member })
	}
},

{
	name: 'роли',
	type: 2 // USER
},

{
	name: 'роли',
	type: 3 // MESSAGE
}

]
