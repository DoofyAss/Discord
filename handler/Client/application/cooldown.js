


$(application)



.add(function cooldown(data, member) {



	// Member

	if (data ?. cooldown ?. member) {

		return (

			data.cooldown.member.get(member.id) || (data.cooldown.member.set(member.id, {

				date: Date.now() + data.cooldown.time,
				timer: setTimeout(() => data.cooldown.member.delete(member.id), data.cooldown.time)

			}), false)
		)
	}



	// Global

	if (data ?. cooldown ?. time) {

		return (

			data.cooldown.status || (data.cooldown.status = {

				date: Date.now() + data.cooldown.time,
				timer: setTimeout(() => delete data.cooldown.status, data.cooldown.time)

			}, false)
		)
	}
})
