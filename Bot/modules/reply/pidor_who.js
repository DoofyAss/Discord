


const random = () => {

	let roleMale = client.guild.roles.cache.get(config.roles.male)
	let roleFemale = client.guild.roles.cache.get(config.roles.female)

	let members = roleMale.members.array.filter(m => m.presence)
	.concat(roleFemale.members.array.filter(m => m.presence))

	return members.random.id
}



module.exports = async m => {

	let sticker = client.guild.stickers.cache.get('989311948950761533')

	let sentence = m.content.match(/кто (.*[^\?])/) ?. [1]

	if (sentence) {

		let timer = Timer({ id: 'reply_whopidor' })

		if (timer.remain) return

		timer.start(60000, null)

		let id = random()

		let content = id == m.author.id ?
		`Ты ${ word }!` : `<@${ id }>, ты ${ sentence }!`

		await m.reply({ content, stickers: [ sticker ] })

		return true
	}
}
