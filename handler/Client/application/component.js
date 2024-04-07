


$(application)



.add(async function component(interaction) {



	let name = interaction.customId

	let root = this.components.find(c => c.name == name)

	if (! root)
	return await application.reply.component_undefined(interaction)



	let thread = [

		root[name],
		root.run

	].find(fn => fn instanceof Function)



	let component = {

		name,
		thread,
		cooldown: this.cooldown(root, interaction.member),
		permission: this.permission(root, interaction.member)
	}



	if (! component.thread)
	return await application.reply
	.component_undefined(interaction)

	if (component.permission)
	return await application.reply
	.component_permission(interaction, component)

	if (component.cooldown)
	return await application.reply
	.component_cooldown(interaction, component)



	let arguments = {

		root,
		interaction,
		member: interaction.member,
		channel: interaction.channel
	}



	component.thread.call(arguments, interaction)
	.then(() => application.reply.component_complete(interaction))
	.catch(e => application.reply.component_complete(interaction, e))
})
