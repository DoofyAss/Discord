


require('./DataBase').init()



const Message = {

	type: [ 0 /* DEFAULT*/, 19 /* REPLY */ ],



	save(message) {

		if (! this.type.includes(message.type)) return
		if (! message.content) return

		let data = {

			message: message.id,
			channel: message.channelId,
			reference: message.reference ?. messageId,

			author: message.author.id,
			content: message.content,

			create: message.createdTimestamp ?. time(),
			edit: message.editedTimestamp ?. time(),
		}

		DataBase.message.insert(data)
	},



	delete(message) {

		let data = { delete: $.time() }

		DataBase.message.update(message.id, data)
	}
}










client.on('messageCreate', message => {

	if (message.author.bot) return

	Message.save(message)
})










client.on('messageUpdate', (old, message) => {

	if (message.author.bot) return

	if (message.pinned == old.pinned)
	Message.save(message)
})










client.on('messageDelete', message => {

	Message.delete(message)
})










client.on('messageDeleteBulk', messages => {

	messages.forEach(message => Message.delete(message))
})
