


module.exports =
DataBase.member = {

	space: 'discord.member',



	async init() {

		await DB(this.space).init({

			member: DB.varchar.unique
		})
	},



	async fetch() {

		return await DB(this.space).fetch()
	}
}
