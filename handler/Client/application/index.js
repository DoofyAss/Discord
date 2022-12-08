


$(global.application = async function application(interaction) {

	if (! interaction.isCommand()) return



	interaction.forceReply = async function (options, timeout) {

		this.deferred || this.replied ?
		await this.editReply(options) :
		await this.reply(options)

		if (timeout) await wait(timeout), await this.deleteReply()
	}



	let command = application.command(interaction)



	if (! command)
	return await application.reply.undefined(interaction)

	if (! command.thread)
	return await application.reply.undefined(interaction, command)

	if (command.permission)
	return await application.reply.permission(interaction, command)

	if (command.cooldown)
	return await application.reply.cooldown(interaction, command)



	let arguments = {

		interaction: interaction,
		member: interaction.member,
		channel: interaction.channel,
		option: application.options(interaction),

		group: (...string) => string
		.map(s => s == interaction.options._group).some(Boolean),

		subcommand: (...string) => string
		.map(s => s == interaction.options._subcommand).some(Boolean),
	}



	command.thread.call(arguments)
	.then(() => application.reply.complete(interaction))
	.catch(e => application.reply.complete(interaction, e))
})



.get('list', [])










.add(async function update() {

	/*let commands = this.list.map(command =>

		(command.type ?

			{ name: command.name, type: command.type } :

			{
				name: command.name,
				description: command.description,
				options: command.options
			}
		)
	)*/

	await client.application.commands.set(this.list)
})










.add(async function include(folder) {

	folder = path.join(require.main.path, folder)

	client.scan(folder).each(command => {

		let put = command => this.list.push(command)

		let ctx = require(command.path)

		Array.isArray(ctx) ? ctx.each(ctx => put(ctx)) : put(ctx)
	})
})






require('./command')
require('./permission')
require('./cooldown')
require('./options')
require('./reply')
