


module.exports = { DB, get column() { return new Column() } }



/*
	DataBase
*/


const MySQL = require('mysql2')

const db = MySQL.createConnection({ host: 'localhost', user: 'root' })
db.connect(error => {

	if (error) console.log(error.message)
})


function DB(table) {

	return new DataBase(table)
}



class DataBase {



	constructor(table) {

		this.TABLE = table
	}



	type(value) {

		switch (typeof value) {

			default:
				return value
			break

			case 'string':
				return `'${ value }'`
			break

			case 'null':
				return 'null'
			break

			case 'boolean':
				return value ? 'true' : 'false'
			break
		}
	}



	get BASE() {

		return this.TABLE.split('.').shift()
	}



	get SQL() {

		return [

			this.QUERY,
			this.WHERE,
			this.ORDER,
			this.LIMIT

		].join('')
	}



	where(key, value) {

		this.WHERE = ` WHERE ${ key } ${ value == null ? 'IS' : '=' } ${ this.type(value) }`
		return this
	}



	like(key, value) {

		this.WHERE = ` WHERE ${ key } LIKE '%${ value }%'`
		return this
	}



	and(key, value) {

		this.WHERE += ` AND ${ key } ${ value == null ? 'IS' : '=' } ${ this.type(value) }`
		return this
	}



	or(key, value) {

		this.WHERE += ` OR ${ key } ${ value == null ? 'IS' : '=' } ${ this.type(value) }`
		return this
	}



	order(key, sort = null) {

		this.ORDER = ` ORDER BY ${ key } ${ sort ? 'DESC' : 'ASC' }`
		return this
	}



	limit(offset, count) {

		this.LIMIT = ` LIMIT ` + (count ? `${ offset }, ${ count }` : offset)
		return this
	}



	catch(callback) {

		this.catch = callback
		return this
	}



	async query() {

		let result = await new Promise(result => {

			console.log(`[${ this.SQL }]`)

			db.query(this.SQL, (err, res) => {

				if (err && this.catch) return this.catch(err.sqlMessage)
				result(res)
			})
		})

		return result
	}



	fetch(callback) {

		this.QUERY = `SELECT * FROM ${ this.TABLE }`

		setTimeout(async () => {

			let response = await this.query()
			callback(response)
		})

		return this
	}



	each(callback) {

		this.fetch(data => data.forEach((row, index) => {

			callback(row, index, data.length)
		}))

		return this
	}



	update() {

		if (typeof arguments[0] == 'string') {

			this.UPDATE = `${ arguments[0] } = ${ this.type( arguments[1] ) }`
		}

		if (typeof arguments[0] == 'object') {

			this.UPDATE = Object.entries( arguments[0] )
			.map(([key, value]) => `${ key } = ${ this.type(value) }`).join(', ')
		}

		this.QUERY = `UPDATE ${ this.TABLE } SET ${ this.UPDATE }`

		setTimeout(() => this.query())

		return this
	}



	insert(data) {

		let keys = Object.keys(data).join(', ')
		let values = Object.values(data).map(value => this.type(value)).join(', ')

		this.QUERY = `INSERT INTO ${ this.TABLE } (${ keys }) VALUES (${ values })`

		setTimeout(() => this.query())

		return this
	}



	delete(alter = true) {

		this.QUERY = `DELETE FROM ${ this.TABLE }`

		setTimeout(async () => {

			await this.query()
			if (alter) db.query(`ALTER TABLE ${ this.TABLE } AUTO_INCREMENT = 1;`)
		})

		return this
	}



	dropTable() {

		this.QUERY = `DROP TABLE ${ this.TABLE }`
		setTimeout(() => this.query())

		return this
	}



	dropBase() {

		this.QUERY = `DROP DATABASE ${ this.BASE }`
		setTimeout(() => this.query())

		return this
	}



	init(structure) {

		let data = { column: [] }

		Object.entries(structure).forEach(([name, column], i) => {

			if (column.INCREMENT)
			data.primarykey = `PRIMARY KEY (${name})`

			data.column.push([

				name,
				column.TYPE,
				column.UNIQUE,
				column.NULL ? 'DEFAULT NULL' : 'NOT NULL',
				column.INCREMENT,
				column.COLLATE

			].join(' ').replace(/\s+/g, ' ').trim())
		})



		if (data.primarykey)
		data.column.push(data.primarykey)



		setTimeout(async () => {

			this.QUERY = `CREATE DATABASE IF NOT EXISTS ${ this.BASE } COLLATE utf8_general_ci`
			await this.query()

			this.QUERY = `CREATE TABLE IF NOT EXISTS ${ this.TABLE } (${ data.column.join(', ') }) ENGINE = MyISAM COLLATE utf8_general_ci`
			await this.query()
		})

		return this
	}
}










class Column {

	get increment() { return new ColumnData('INT').increment }
	get integer() { return new ColumnData('INT') }
	get varchar() { return new ColumnData('VARCHAR(255)').collate }
	get string() { return new ColumnData('TEXT').collate }
}



class ColumnData {



	constructor(type) {

		this.TYPE = type
	}



	get increment() {

		this.INCREMENT = 'AUTO_INCREMENT'
		return this
	}



	get collate() {

		this.COLLATE = 'COLLATE utf8_general_ci'
		return this
	}



	get unique() {

		this.UNIQUE = 'UNIQUE'
		return this
	}



	get null() {

		this.NULL = true
		return this
	}
}
