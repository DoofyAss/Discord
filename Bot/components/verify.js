


module.exports = [

{
	name: 'verify',

	async run(interaction) {

		if (await application.chill(interaction, 10000)) return
	}
}

]
