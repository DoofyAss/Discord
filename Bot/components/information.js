


client.on('ready', async () => {

	let channel_id = client.guild.rulesChannelId
	let channel = client.guild.channels.cache.get(channel_id)

	let messages = await channel.messages.fetch({ limit: 5 })

	let buttons = messages.filter(m => m.components.length)
	.map(e => e.components.shift().components.shift().data.custom_id)



	if (! buttons.includes('verify')) {

		let components = []
		let embeds = []



		let info = `Новичкам недоступны некоторые команды, создание приватных комнат, встраивание ссылок и прикрепление файлов.\n\n`
		info += `Роль <@&${ config.roles.newbie }> пропадёт через 7 дней.`

		let helper = `<:role_Helper:1043344781847298198> \u200b \u200b Помощник\n\n`
		helper += `Роль <@&${ config.roles.Helper }> нужна для участия обсуждения сервера. Вам открывается доступ к форуму и информации о разработке.`



		embeds.push({ color: color.gray, description: info })
		embeds.push({ color: color.gray, description: helper })

		components.push({

			type: 1,
			components: [

				{
					type: 2,
					style: 2,
					label: 'верификация',
					custom_id: 'verify'
				},
				{
					type: 2,
					style: 2,
					label: 'хочу быть помощником',
					custom_id: 'helper'
				}
			]
		})

		await channel.send({ components: components, embeds: embeds })
	}
})
