


module.exports = { DB }



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
}
