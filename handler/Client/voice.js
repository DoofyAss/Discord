


client.on('voiceStateUpdate', async (old_state, new_state) => {



	let member = client.guild.members.cache.get(new_state.id)

	if (member.user.bot) return

	let O = old_state.channelId
	let N = new_state.channelId

	let left = client.guild.channels.cache.get(old_state.channelId)
	let join = client.guild.channels.cache.get(new_state.channelId)



	let state = {

		left: ! N && O,
		join: ! O && N,

		move: O && N && O != N,

		update: O == N,
		any: O != N // join, left or move
	}



	if (state.left) client.emit('voiceLeft', { member, channel: left, state })
	if (state.join) client.emit('voiceJoin', { member, channel: join, state })
	if (state.move) client.emit('voiceMove', { member, left, join, state })

	if (state.update) client.emit('voiceUpdate', { member, channel: join, state })
	if (state.any) client.emit('voiceAny', { member, left, join, state })
})
