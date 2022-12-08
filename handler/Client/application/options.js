


$(application)



.add(function options(interaction) {



	function type(option) {

		switch (option.type) {

			case 6: return option.member || option // USER
			case 7: return option.channel // CHANNEL
			case 8: return option.role // ROLE
			case 9: return option.member || option.role // MENTIONABLE
			case '_MESSAGE': return option.message
			case 11: return option.attachment // ATTACHMENT

			default: return option.value
		}
	}



	function name(option) {

		if (option.type)
		if (option.name == 'user')
		return ['member']

		return [option.name]
	}



	let options = interaction.options._hoistedOptions
	.map(option => [ name(option), type(option) ])

	return Object.fromEntries(options)
})
