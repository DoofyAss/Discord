


const Helper = {



	maximum: {

		ephemeral: true,

		embeds: [{

			color: color.red,
			description: `Достигнуто максимальное количество помощников \u200b ${ emoji.sad }`
		}]
	},



	verify: {

		ephemeral: true,

		embeds: [{

			color: color.red,
			description: `Сначала нужна авторизация \u200b ${ emoji.sad }`
		}]
	},



	already: {

		ephemeral: true,

		embeds: [{

			color: color.gray,
			description: `Роль уже имеется \u200b ${ emoji.positive }`
		}],

		components: [{

			type: 1,
			components: [

				{
					type: 2,
					style: 4,
					label: 'убрать роль',
					custom_id: 'helper_remove',
				}
			]
		}]
	},



	undefined: {

		ephemeral: true,

		embeds: [{

			color: color.red,
			description: `Роли уже нет \u200b ${ emoji.neutral }`
		}]
	},



	add: {

		ephemeral: true,

		embeds: [{

			color: color.green,
			description: `Роль добавлена \u200b ${ emoji.positive }`
		}]
	},



	remove: {

		ephemeral: true,

		embeds: [{

			color: color.green,
			description: `Роль убрана \u200b ${ emoji.neutral }`
		}]
	}
}


module.exports = [

{
	name: 'helper',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return



		let role_id = config.roles.Helper



		let male = interaction.member._roles.includes(config.roles.male)
		let female = interaction.member._roles.includes(config.roles.female)

		if (! male && ! female)
		return await interaction.reply(Helper.verify)



		if (interaction.member._roles.includes(role_id))
		return await interaction.reply(Helper.already)



		let role = client.guild.roles.cache.get(role_id)

		if (role.members.size > 10)
		return await interaction.reply(Helper.maximum)


		await interaction.member.roles.add(role_id)
		await interaction.reply(Helper.add)
	}
},

{
	name: 'helper_remove',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return



		let role_id = config.roles.Helper


		if (! interaction.member._roles.includes(role_id))
		return await interaction.reply(Helper.undefined)

		await interaction.member.roles.remove(role_id)
		await interaction.reply(Helper.remove)
	}
}

]
