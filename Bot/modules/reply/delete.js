


const replies = [

	'Ухади', 'Ты кто?', 'Не буду', 'От тебя гавной воняет',
	'Удалялки отключены за неуплату'
]



module.exports = async m => {

	if (! m.content.startsWith('удоли')) return

	let id = m.reference ?. messageId
	if (! id) return



	if (! Boolean(m.member.permissions.bitfield & 0x2000n)) {

		let timer = Timer({ id: 'reply_delete' })

		if (timer.remain)
		return await m.delete().catch(e => undefined)

		timer.start(3000000, null)

		let reply = await m.reply(`${ replies.random } \u200b ${ emoji.negative }`)
		return setTimeout(async () => {

			await m.delete().catch(e => undefined)
			await reply.delete().catch(e => undefined)

		}, 5000)
	}



	let message = await m.channel.messages.fetch(id)

	id ? await message.delete().catch(e => undefined) :
	await m.delete().catch(e => undefined)



	return true
}
