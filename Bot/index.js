

const { Client } = require('discord.js')

global.client = new Client({ intents: 3276799, partials: [ 0, 1, 2, 3, 4, 5, 6 ] })










require('../handler')(async () => {

	// client.include('modules')

	application.include(application.commands, 'commands')
	application.include(application.components, 'components')

	client.info()
	client.login($.__token)
})










client.on('ready', async () => {

	// await application.update()

	let member = await client.member('969978235116978316')

	console.log( member )

	// await member.sync()
	// await member.save()
})










client.on('interactionCreate', async interaction => {

	await application(interaction)
})
