


const positive = [

	'Несомненно',
	'Без сомнения',
	'Да, безусловно',
	'Определенно так',
	'Твоя мамка сказала «да»',
	'Знаки указывают на «да»'
]

const neutral = [

	'Незнаю',
	'Неизвестно',
	'Мне не сказали',
	'Да хуй его знает',
	'Спрошу завтра у твоей мамки',
	'Чё доебались со своими вопросами'
]

const negative = [

	'Сомнительно',
	'Я так не думаю',
	'Маловероятно',
	'Мой ответ «нет»',
	'Твой дед сказал «нет»',
	'Мои источники говорят «нет»'
]



module.exports = async m => {

	if (! m.content.match(/🔮(.*\\?)/)) return



	let timer = Timer({ id: 'reply_magic', member: m.author.id })

	if (timer.remain) {

		let reply = await m.reply({

			embeds: [{

				color: color.red,
				description: `Перезарядка \u200b ${ emoji.sad } \u200b ${ timer.left }`
			}]
		})

		setTimeout(async () => {

			await m.delete().catch(e => undefined)
			await reply.delete().catch(e => undefined)

		}, 5000)

		return true
	}

	timer.start(60000, null)



	let answers = [

		{ color: color.blue, content: neutral.random, emoji: emoji.neutral },
		{ color: color.green, content: positive.random, emoji: emoji.positive, a: '<a:a_yes:1009573830332788786>' },
		{ color: color.red, content: negative.random, emoji: emoji.negative, a: '<a:a_no:1009573827883319386>' }
	]

	let random = $.random(128, 1024) / 8 * $.random(4, 16)

	let answer = random > 256 ? random > 555 ? answers[1] : answers[2] : answers[0]

	let reply = await m.reply(`${ answer.content } \u200b ${ answer.emoji }`)

	if (answer.a) await reply.react(answer.a)



	return true
}
