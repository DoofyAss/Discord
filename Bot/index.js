

const { Client } = require('discord.js')

global.client = new Client({ intents: 3276799, partials: [ 0, 1, 2, 3, 4, 5, 6 ] })










require('../handler')(async () => {

	client.include('modules')

	application.include(application.commands, 'commands')
	application.include(application.components, 'components')

	client.info()
	client.login($.__token)
})










client.on('ready', async () => {

	// await application.update()

	// let member = await client.member('276065303614455810')

	// let member = await client.member('974361746968019014')
	// member = member.cache

	// console.log( member )

	// console.log( member.newbie.left )

	// console.log( member.newbie )

	// await member.sync()
	// await member.save()
})










client.on('interactionCreate', async interaction => {

	await application(interaction)
})
