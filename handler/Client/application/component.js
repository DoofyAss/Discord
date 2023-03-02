


$(application)



.add(async function component(interaction) {



	let id = interaction.customId

	let root = this.components.find(c => c.name == id || c.name.includes(id))

	if (! root)
	return await application.reply.disabled(interaction)



	let thread = [

		root[interaction.customId],
		root.run

	].find(fn => fn instanceof Function)

	if (! thread)
	return await application.reply.disabled(interaction)

	await thread.call(interaction, interaction)
	.then(() => application.reply.component(interaction))
	.catch(async (e) => await application.reply.component(interaction, e))
})










.add(async function chill(interaction, time) {

	let timer = Timer({

		id: 'component',
		custom: interaction.customId,
		member: interaction.user.id
	})

	let remain = timer.remain ? true : ( timer.start(time), false )

	if (remain)
	await application.reply.chill(interaction, timer.left)

	return remain
})
