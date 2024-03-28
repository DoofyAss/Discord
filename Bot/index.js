


global.Discord = require('discord.js')
global.client = new Discord.Client({ intents: 3276799, partials: [ 0, 1, 2, 3, 4, 5, 6 ] })











require('../handler')(async () => {

	client.include('modules')

	application.include(application.commands, 'commands')
	application.include(application.commands, 'commands/dev')
	application.include(application.components, 'components')

	client.info()
	client.login($.__token)
})










client.on('ready', async () => {

	// await application.update()
})










client.on('interactionCreate', async interaction => {

	await application(interaction)
})
