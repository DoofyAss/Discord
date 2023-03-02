


$(application.reply = {})



.add(async function disabled(interaction) {

	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [{

			color: color.red,
			description: [

				`Компонент не найден или отключён`, emoji.sad

			].join(' \u200b ')
		}]

	})
})










.add(async function undefined(interaction, command) {

	name = command?.name || interaction.commandName

	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [{

			color: color.red,
			description: [

				`Команда`, `**${ name }**`,
				`не найдена или отключена`, emoji.sad

			].join(' \u200b ')
		}]

	})
})










.add(async function permission(interaction, command) {

	name = command?.name || interaction.commandName

	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [

			{
				color: color.red,
				description: [

					`Нет прав для выполнения команды`,
					`**${ name }**`, emoji.negative

				].join(' \u200b ')
			},
			{
				color: color.blue,
				description: command.permission
			}
		]

	})
})










.add(async function cooldown(interaction, command) {

	name = command?.name || interaction.commandName

	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [{

			color: color.red,
			description: [

				`Команда`, `**${ name }**`, `перезаряжается`,
				emoji.sad, command.cooldown.date.left

			].join(' \u200b ')
		}]

	})
})










.add(async function chill(interaction, left) {

	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [{

			color: color.red,
			description: [

				`Компонент перезаряжается`, emoji.sad, left

			].join(' \u200b ')
		}]

	})
})










.add(async function component(interaction, exception) {



	if (exception) {

		console.err('component error')
		console.log(exception)

		return await interaction.forceReply({

			ephemeral: true,
			content: null,
			embeds: [{

				color: color.red,
				description: `Ошибка при выполнении \u200b ${ emoji.sad }`
			}]

		}, 3000)
	}



	if (! interaction.replied)
	await interaction.deferUpdate()
})










.add(async function complete(interaction, exception) {



	if (exception) {

		console.err('application error')
		console.log(exception)

		return await interaction.forceReply({

			ephemeral: true,
			content: null,
			embeds: [{

				color: color.red,
				description: `Ошибка при выполнении \u200b ${ emoji.sad }`
			}]

		}, 3000)
	}



	if (! interaction.replied)
	await interaction.forceReply({

		ephemeral: true,
		content: null,
		embeds: [{

			color: color.green,
			description: `Выполнено \u200b ${ emoji.positive }`
		}]

	}, 3000)
})
