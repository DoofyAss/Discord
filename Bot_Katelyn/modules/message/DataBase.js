


module.exports =
DataBase.message = {

	space: 'discord.message',



	async init() {

		await DB(this.space).init({

			id: DB.increment,

			message: DB.varchar.null,
			channel: DB.varchar.null,
			reference: DB.varchar.null,

			author: DB.varchar.null,
			content: DB.text.null,

			create: DB.varchar.null,
			edit: DB.varchar.null,
			delete: DB.varchar.null,

			system: DB.boolean.null
		})
	},



	async insert(data) {

		return await DB(this.space).insert(data)
	},



	async update(id, data) {

		return await DB(this.space, 'message', id).update(data)
	}
}
