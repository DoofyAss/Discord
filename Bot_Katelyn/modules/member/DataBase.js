


module.exports =
DataBase.member = {

	space: 'discord.member',



	async init() {

		await DB(this.space).init({

			id: DB.varchar.unique,

			username: DB.varchar.null,
			nickname: DB.varchar.null,
			globalname: DB.varchar.null,

			mute: DB.integer.unsigned.null,
			join: DB.integer.unsigned.null,
			left: DB.integer.unsigned.null,
			count: DB.integer.unsigned.null
		})
	},



	async fetch(id) {

		return await id ?
		DB(this.space, id).fetch(1) :
		DB(this.space).fetch()
	},



	async insert(data) {

		return await DB(this.space).insert(data)
	}
}



$(DataBase.member)



.get(async function newbies() {

	let now = parseInt((Date.now() - 604800000) / 1000)

	let query = await DB.query(`SELECT id FROM ${ this.space } WHERE \`join\` > ${ now }`)

	return query.map(e => e.id)
})
