


let antispam = require('./antispam')

let bad = require('./bad')
let del = require('./delete')
let anime = require('./anime')
let magic = require('./magic')
let pidor_for = require('./pidor_for')
let pidor_who = require('./pidor_who')
let reactions = require('./reactions')



client.on('messageCreate', async m => {

	if (m.author.bot) return

	if (! [ config.channel.chat ].includes(m.channelId)) return

	m.content = m.content.toLowerCase().replace('ё', 'е')



	if (await antispam(m)) return

	if (await bad(m)) return
	if (await del(m)) return
	if (await anime(m)) return

	if (await magic(m)) return

	if (await pidor_for(m)) return
	if (await pidor_who(m)) return

	await reactions(m)
})
