


const link = async string => {

	if (string.match('discord.gg')) return true
	if (string.match('discord.com/invite')) return true

	let url = string.split(' ').find(e => e.match('https://'))

	if (! url) return

	let response = await fetch(url, { redirect: 'follow' })

	return response.redirected ? await link(response.url) : false
}



const Antispam = { list: {} }



module.exports = async m => {



	if (await link(m.content)) {

		let remain = 86400000

		await m.delete().catch(e => undefined)
		await m.member.timeout(remain, 'ссылка-приглашение').catch(e => undefined)
		await m.channel.send({

			content: `<@${ m.author.id }>`,
			embeds: [{

				color: color.red,
				description: `${ ($.time('ms') + remain).tR } снятие таймаута\nПричина: ссылка-приглашение`
			}]
		})

		return true
	}



	let item = Antispam.list[m.author.id] ??=
	{ messages: [], sorry: false, level: 0 }



	if (item.level == 3) {



		if (m.content.match(/извинис|извенис/ug)) {

			let reply = await m.reply(`Нет, это ты извинись \u200b ${ emoji.negative }`)

			setTimeout(async () => {

				await m.delete().catch(e => undefined)
				await reply.delete().catch(e => undefined)

			}, 3000)

			return item.messages.length > 3
		}



		if (m.content.match(/извините|извини|извени|сорян|сори|прощение|извиняюсь|sorry|прости|простите/ug)) {

			item.level = 0
			item.sorry = true

			m.reply(`Ладно \u200b ${ emoji.positive }`)

		} else {

			m.delete().catch(e => undefined)
		}

		return item.messages.length > 3
	}



	item.messages.push(m)



	let timer = Timer({ id: 'reply_antispam', member: m.author.id })

	timer.restart(2000, async () => {



		if (item.messages.length < 4)
		return item.messages = []



		m.channel.bulkDelete(item.messages, true).catch(e => undefined)
		item.messages = []



		if (item.sorry) {

			let remain = 3600000
			item.sorry = false

			await m.member.timeout(remain, 'спам').catch(e => undefined)
			await m.channel.send({

				content: `<@${ m.author.id }>`,
				embeds: [{

					color: color.red,
					description: `${ ($.time('ms') + remain).tR } снятие таймаута`
				}]
			})

			return true
		}



		item.level++



		if (item.level == 1) {

			return await m.channel.send(`<@${ m.author.id }>, не спамь! \u200b ${ emoji.negative }`)
			.then(m => setTimeout(() => m.delete(), 5000))
		}



		if (item.level == 2) {

			let reply = [

				'тебе въебать?',
				'последствий хочешь?',
				'охуеваешь на глазах',
				'последнее предупреждение'

			].random

			return await m.channel.send(`<@${ m.author.id }>, ${ reply } \u200b ${ emoji.negative }`)
			.then(m => setTimeout(() => m.delete(), 5000))
		}



		if (item.level == 3) {

			return await m.channel.send(`<@${ m.author.id }>, буду удалять все твои сообщения, пока не извинишься \u200b ${ emoji.negative }`)
		}
	})
}
