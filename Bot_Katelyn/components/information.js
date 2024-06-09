


const create = async () => {

	let components = []
	let embeds = []



	let info = `Новичкам недоступны некоторые команды, создание приватных комнат, встраивание ссылок и прикрепление файлов.\n\n`
	info += `Роль <@&${ config.roles.newbie }> пропадёт через 7 дней.`



	embeds.push({ color: color.gray, description: info })



	components.push({

		type: 1,
		components: [

			{
				type: 2,
				style: 2,
				label: 'верификация',
				custom_id: 'verify'
			}
		]
	})



	await channel.send({ components: components, embeds: embeds })
}



client.on('ready', async () => {

	let channel_id = client.guild.rulesChannelId
	let channel = client.guild.channels.cache.get(channel_id)

	let messages = await channel.messages.fetch({ limit: 5 })

	let buttons = messages.filter(m => m.components.length)
	.map(e => e.components.shift().components.shift().data.custom_id)

	if (! buttons.includes('verify')) create()
})
