


const replies = [

	'Кто пукнул?',
	'Чё говном воняет?',
	'Почему воняет пердой?',
	'Чувствуете запах какашек?',
	'Несёт прям как с канализации...',
	'Я тут накакала, уберите кто-нибудь'
]



module.exports = async m => {

	if (! m.content.match(/аниме|анимэ|anime/ug)) return

	let timer = Timer({ id: 'reply_anime' })

	if (timer.remain) return

	timer.start(300000, null)

	await m.channel.send(replies.random)
	.then(message => message.react('<a:pooo:1003291402555371530>'))

	return true
}
