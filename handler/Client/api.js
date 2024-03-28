


$(Discord.VoiceChannel.prototype)



.add(async function status(string) {

	/**
		let channel = client.guild.channels.cache.get('id')
		await channel.status('name')
	*/

	let url = `https://discord.com/api/v10/channels/${ this.id }/voice-status`

	await fetch(url, {

		method: 'PUT',
		headers: {

			'Authorization': `Bot ${ $.__token }`,
			'Content-Type': 'application/json'
		},

		body: JSON.stringify({ string })
	})

	.catch(e => undefined)
})
