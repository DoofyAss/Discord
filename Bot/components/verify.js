


const Embed = {

	choose: {

		ephemeral: true,

		embeds: [{

			color: color.gray,
			description: 'Для полного доступа к серверу выберите пол'
		}],

		components: [{

			type: 1,
			components: [

				{
					type: 2,
					style: 2,
					label: '\u200b \u200b Парень',
					custom_id: 'choose_male',
					emoji: '🍌'
				},
				{
					type: 2,
					style: 2,
					label: '\u200b \u200b Девушка',
					custom_id: 'choose_female',
					emoji: '🍓'
				}
			]
		}]
	},



	confirm: {

		male: {

			ephemeral: true,

			embeds: [{

				color: color.red,
				description: 'Роль нельзя будет изменить'
			}],

			components: [{

				type: 1,
				components: [

					{
						type: 2,
						style: 4,
						label: 'Да, я парень',
						custom_id: 'confirm_male',
					}
				]
			}]
		},

		female: {

			ephemeral: true,

			embeds: [{

				color: color.red,
				description: 'Роль нельзя будет изменить'
			}],

			components: [{

				type: 1,
				components: [

					{
						type: 2,
						style: 4,
						label: 'Да, я девушка',
						custom_id: 'confirm_female'
					}
				]
			}]
		}
	},



	async check(interaction) {

		let already = interaction.member._roles.some(r =>
		[ config.roles.male, config.roles.female ].includes(r))

		if (already) {

			await interaction.reply({

				ephemeral: true,
				embeds: [{

					color: color.gray,
					description: `Вы уже верифицированы \u200b ${ emoji.positive }`
				}]
			})

			return true
		}
	}
}





module.exports = [

{
	name: 'verify',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return

		if (await Embed.check(interaction)) return

		await interaction.reply(Embed.choose)
	}
},

{
	name: 'choose_male',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return

		if (await Embed.check(interaction)) return

		await interaction.update(Embed.confirm.male)
	}
},

{
	name: 'choose_female',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return

		if (await Embed.check(interaction)) return

		await interaction.update(Embed.confirm.female)
	}
},

{
	name: 'confirm_male',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return

		if (await Embed.check(interaction)) return

		await interaction.member.roles.add(config.roles.male)

		await interaction.update({

			ephemeral: true,
			embeds: [{

				color: client.guild.roles.cache.get(config.roles.male).color,
				description: `Мужская роль выдана`
			}],
			components: []
		})

		client.emit('guildMemberVerify', interaction.member.id )
	}
},

{
	name: 'confirm_female',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return

		if (await Embed.check(interaction)) return

		await interaction.member.roles.add(config.roles.female)

		await interaction.update({

			ephemeral: true,
			embeds: [{

				color: client.guild.roles.cache.get(config.roles.female).color,
				description: `Женская роль выдана`
			}],
			components: []
		})

		client.emit('guildMemberVerify', interaction.member.id )
	}
}

]
