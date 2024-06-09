


const check = async interaction => {

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










module.exports = [

{
	name: 'verify',
	cooldown: { time: 5000, member: new Map },

	async run(interaction) {

		if (await check(interaction)) return

		await interaction.reply({

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
						emoji: '1221260906827087953'
					},
					{
						type: 2,
						style: 2,
						label: '\u200b \u200b Девушка',
						custom_id: 'choose_female',
						emoji: '1221260896463093861'
					}
				]
			}]
		})
	}
},

{
	name: 'choose_male',
	cooldown: { time: 5000, member: new Map },

	async run(interaction) {

		if (await check(interaction)) return

		await interaction.update({

			ephemeral: true,

			embeds: [{

				color: color.red,
				description: 'Роль нельзя будет изменить \u200b <:role_Male:1221259930829459619>'
			}],

			components: [{

				type: 1,
				components: [

					{
						type: 2,
						style: 4,
						label: 'Да, я парень',
						custom_id: 'confirm_male'
					}
				]
			}]
		})
	}
},

{
	name: 'choose_female',
	cooldown: { time: 5000, member: new Map },

	async run(interaction) {

		if (await check(interaction)) return

		await interaction.update({

			ephemeral: true,

			embeds: [{

				color: color.red,
				description: 'Роль нельзя будет изменить \u200b <:role_Female:1221259929428561991>'
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
		})
	}
},

{
	name: 'confirm_male',
	cooldown: { time: 5000, member: new Map },

	async run(interaction) {

		if (await check(interaction)) return

		await interaction.member.roles.add(config.roles.male)

		await interaction.update({

			ephemeral: true,
			embeds: [{

				color: client.guild.roles.cache.get(config.roles.male).color,
				description: `Роль выдана \u200b <:role_Male:1221259930829459619>`
			}],
			components: []
		})

		client.emit('guildMemberVerify', interaction.member.id)
	}
},

{
	name: 'confirm_female',
	cooldown: { time: 5000, member: new Map },

	async run(interaction) {

		if (await check(interaction)) return

		await interaction.member.roles.add(config.roles.female)

		await interaction.update({

			ephemeral: true,
			embeds: [{

				color: client.guild.roles.cache.get(config.roles.female).color,
				description: `Роль выдана \u200b <:role_Female:1221259929428561991>`
			}],
			components: []
		})

		client.emit('guildMemberVerify', interaction.member.id)
	}
}

]
