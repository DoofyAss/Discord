


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

		body: JSON.stringify({ status: string })
	})

	.catch(e => undefined)
})










$(Discord.BaseChannel.prototype)



.add(async function sendVoice(file, reply) {

	/*
		let channel = client.guild.channels.cache.get('id')
		await channel.sendVoice('voice-message.ogg', 3)
	*/



	if (! fs.existsSync(file))
	return console.err(file, 'not found')



	let data = fs.readFileSync(file)
	let stats = fs.statSync(file)



	// get upload url

	let response = await fetch(`https://discord.com/api/v10/channels/${ this.id }/attachments`, {

		method: 'POST',
		headers: {

			'Authorization': `Bot ${ $.__token }`,
			'Content-Type': 'application/json'
		},

		body: JSON.stringify({

			files: [{

				filename: 'voice-message.ogg',
				file_size: stats.size,
				id: '2'
			}]
		})
	})

	.catch(e => undefined)

	let attachments = (await response.json()).attachments.shift()



	// upload audio

	let responseUpload = await fetch(attachments.upload_url, {

		method: 'PUT',
		headers: {

			'Authorization': `Bot ${ $.__token }`,
			'Content-Type': 'audio/ogg'
		},

		body: data
	})

	.catch(e => undefined)



	// send message

	let duration = await audioDuration(file)
	let waveform = await audioWaveform(file)


	let message = {

		flags: 8192,
		attachments: [{

			id: '0',
			filename: 'voice-message.ogg',
			uploaded_filename: attachments.upload_filename,
			duration_secs: duration, waveform
		}]
	}



	if (reply) message.message_reference = {

		channel_id: this.id,
		guild_id: client.guild.id,
		message_id: reply
	}



	let res = await fetch(`https://discord.com/api/v10/channels/${ this.id }/messages`, {

		method: 'POST',
		headers: {

			'Authorization': `Bot ${ $.__token }`,
			'Content-Type': 'application/json'
		},

		body: JSON.stringify(message)
	})

	.catch(e => undefined)
})
