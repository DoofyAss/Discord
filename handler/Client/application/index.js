


$(global.application = async function application(interaction) {



	interaction.forceReply = async function (options, timeout) {

		this.deferred || this.replied ?
		await this.editReply(options) :
		await this.reply(options)

		if (timeout) await wait(timeout), await this.deleteReply()
	}



	if (interaction.isCommand())
	return await application.command(interaction)



	if (interaction.isMessageComponent())
	return await application.component(interaction)
})



.get('commands', [])
.get('components', [])










.add(async function update() {

	/*let commands = this.commands.map(command =>

		(command.type ?

			{ name: command.name, type: command.type } :

			{
				name: command.name,
				description: command.description,
				options: command.options
			}
		)
	)*/

	await client.application.commands.set(this.commands)
})










.add(async function include(array, folder) {

	folder = path.join(require.main.path, folder)

	client.scan(folder).each(command => {

		let put = command => array.push(command)

		let ctx = require(command.path)

		Array.isArray(ctx) ? ctx.each(ctx => put(ctx)) : put(ctx)
	})
})










require('./command')
require('./component')
require('./permission')
require('./cooldown')
require('./options')
require('./reply')
