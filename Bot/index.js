

const { Client } = require('discord.js')

global.client = new Client({ intents: 3276799, partials: [ 0, 1, 2, 3, 4, 5, 6 ] })










require('../handler')(async () => {

	client.include('modules')
	application.include('commands')

	client.info()
	client.login(require('./token'))
})










client.on('ready', async () => {

	// await application.update()
})










client.on('interactionCreate', async interaction => {

	await application(interaction)
})
