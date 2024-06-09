



const variants = [

	'мне плохо', 'мне грустно', 'мне одиноко', 'мне хуево', 'заебался', 'устал'
]

const sounds = [

	'sound/pohui/01.ogg',
	'sound/pohui/02.ogg',
	'sound/pohui/03.ogg',
]


module.exports = async m => {



	let v = variants.map(e => m.content.match(e))

	if (! v.some(Boolean)) return



	let timer = Timer({ id: 'reply_bad' })

	if (timer.remain) return

	timer.start(300000, null)

	await m.channel.sendVoice(sounds.random, m.id)



	return true
}
