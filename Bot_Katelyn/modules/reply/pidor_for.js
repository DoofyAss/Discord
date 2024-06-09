


const Az = require('az')



async function morph(string) {

	let morph = string.split(' ').map(word => {

		return new Promise(resolve => {

			Az.Morph.init(() => resolve( Az.Morph(word).shift() ))
		})
	})

	return await Promise.all(morph)
}



async function noun(string) {

	let mo = await morph(string)

	let words = mo.filter(m => m ?. tag ?. POST == 'NOUN')

	try { return words.random.normalize().word } catch {}
}



module.exports = async m => {

	if ($.random(128, 1024) / 8 * $.random(1, 16) > 48) return

	if (no = await noun(m.content)) {

		let message = await m.reply(`${ no.tU } для пидоров`).catch(e => undefined)
		await message ?. react(['🏳️‍🌈', '🌈'].random).catch(e => undefined)

		return true
	}
}
