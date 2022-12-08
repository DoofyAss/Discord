


module.exports =
DataBase.message = {

	space: 'discord.message',

	async init() {

		await DB(this.space).init({

			id: DB.increment,
			message: DB.varchar
		})
	}
}
