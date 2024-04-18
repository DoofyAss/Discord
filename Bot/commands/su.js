


module.exports = [

{
	name: 'su',
	description: '⚡ получить супер права',
	allow: [

		config.roles.Admin,
		config.roles.Developer
	],



	async run() {

		let member = this.interaction.member

		let has = member._roles.includes(config.roles.su)

		has ? await member.roles.remove(config.roles.su) :
		await member.roles.add(config.roles.su)

		await this.interaction.reply({

			ephemeral: true,
			embeds: [{

				color: color.gray,
				description: `${ has ? 'Супер права убраны' : 'Супер права выданы' } \u200b ${ emoji.positive }`
			}]
		})
	}
},

{
	name: 'su',
	type: 2 // USER
},

{
	name: 'su',
	type: 3 // MESSAGE
}

]
