


module.exports = async m => {

	if (m.content.match(/петух|питух|петуш|питуш|курица|несушка|несуха|kfc|кфс|кфц/ug))
	await m.react(['🐔', '🐓', '🍗'].random).catch(e => undefined)

	if (m.content.match(/[\w+]* для пидоров|[\w+]* для пидарасов|жопоеб|жопотрах|гей|педик|пидор|пидрила|пидарюга|гомосек|гомик|глиномес|говномес|голубой|гомодрил|лезбиянка|лезбуха|лезба/ug))
	await m.react(['🏳️‍🌈', '🌈'].random).catch(e => undefined)

	if (m.content.match(/мухомор|мухамор|гриб|поганец|гнилой|гниль/ug))
	await m.react('🍄').catch(e => undefined)

	if (m.content.match(/крыса|мышь| вор|воришка|спиздил|украл|подрезал/ug))
	await m.react(['🐀', '🐁'].random).catch(e => undefined)

	if (m.content.match(/черн|шоколад|шоколадный|негр|негритос|уголек|негативчик|черный|черномазый|черножопый|эфиоп|сникерс/ug))
	await m.react(['🍫', '🐵', '👦🏿', '🙉', '👨🏿‍🦲', '🙊', '👶🏿'].random).catch(e => undefined)

	if (m.content.match(/бот хороший|хороший бот|бот лапочка|лапочка бот/ug))
	await m.react(['😇', '🥰', '😘', '😜'].random).catch(e => undefined)
}
