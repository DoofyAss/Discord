


const random = () => {

	let roleMale = client.guild.roles.cache.get(config.roles.male)
	let roleFemale = client.guild.roles.cache.get(config.roles.female)

	let members = roleMale.members.array.filter(m => m.presence)
	.concat(roleFemale.members.array.filter(m => m.presence))

	return members.random.id
}



const words = [

	'пидорас', 'пидарас', 'пидор', 'пидар', 'педик', 'петух',
	'шлюха', 'проститутка', 'куртизанка', 'давалка'
]



module.exports = async m => {



	let sticker = client.guild.stickers.cache.get('989311948950761533')

	for (word of words) {

		if (m.content.match(`кто ${ word }`)) {



			let timer = Timer({ id: 'reply_whopidor' })

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

				return false
			}

			timer.start(60000, null)



			let id = random()

			let content = id == m.author.id ?
			`Ты ${ word }!` : `<@${ id }>, ты ${ word }!`

			await m.reply({ content, stickers: [ sticker ] })

			return true
		}
	}
}
