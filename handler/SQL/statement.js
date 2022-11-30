


$(SQL.prototype)










.add('insert', async function(data) {

	let columns = Object.keys(data).map(column => `\`${ column }\``).join(', ')
	let values = Object.values(data).map(value => this.type(value)).join(', ')

	this.STATEMENT = `INSERT INTO ${ this.SPACE } (${ columns }) VALUES (${ values })`

	let update = Object.entries(data)
	.map(([column, value]) => `\`${ column }\` = ${ this.type(value) }`).join(', ')

	this.STATEMENT += ` ON DUPLICATE KEY UPDATE ${ update }`

	return await this.query()
})










.add('update', async function(data) {

	this.UPDATE = Object.entries(data)
	.map(([column, value]) => `\`${ column }\` = ${ this.type(value) }`).join(', ')

	this.STATEMENT = `UPDATE ${ this.SPACE } SET ${ this.UPDATE }`

	return await this.query()
})










.add('fetch', async function(callback) {

	this.STATEMENT = `SELECT * FROM ${ this.SPACE }`

	if (typeof callback == 'number')
	this.limit(callback)

	let data = await this.query()

	if (typeof callback == 'number')
	return callback == 1 ? data.shift() : data

	if (typeof callback == 'function')
	callback( data )

	return data
})










.add('delete', async function(alter = false) {

	this.STATEMENT = `DELETE FROM ${ this.SPACE }`

	let response = await this.query()
	if (alter) await this.query(`ALTER TABLE ${ this.SPACE } AUTO_INCREMENT = 1`)

	return response
})










.add('clear', async function() {

	this.STATEMENT = `TRUNCATE ${ this.SPACE }`

	return this.TABLE ? await this.query() : false
})










.add('drop', async function() {

	this.STATEMENT = `DROP ${ this.TABLE ? 'TABLE' : 'DATABASE' } ${ this.SPACE }`
	return await this.query()
})
