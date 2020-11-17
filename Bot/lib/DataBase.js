


module.exports = { DB, get column() { return new Column() } }



/*
	DataBase
*/



const MySQL = require('mysql2')
const db = MySQL.createConnection({ host: 'localhost', user: 'root' })



function DB(table, ...arg) {

	if (arg.length == 2)
	return new DataBase(table).where(arg[0], arg[1])

	if (arg.length == 1)
	return new DataBase(table).where('id', arg[0])

	return new DataBase(table)
}



class DataBase {



	constructor(table) {

		this.TABLE = table
	}



	get BASE() {

		return this.TABLE.split('.').shift()
	}



	type(value) {

		switch (typeof value) {

			default:
				return value ? value : 'null'
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



		db.connect(err => {

			if (err && this.catch)
			return this.catch(err)
		})



		let result = await new Promise(result => {

			// console.log(this.SQL) // debug

			db.query(this.SQL, (err, res) => {

				if (err && this.catch)
				return this.catch(err.sqlMessage)

				result(res)
			})
		})

		return result
	}



	async fetch(callback) {

		this.QUERY = `SELECT * FROM ${ this.TABLE }`

		let result = await this.query()

		if (callback) callback( result )
		return result
	}



	each(callback) {

		this.all(data => data.forEach((row, index) => {

			callback(row, index, data.length)
		}))

		return this
	}



	async update() {

		if (typeof arguments[0] == 'string') {

			this.UPDATE = `${ arguments[0] } = ${ this.type( arguments[1] ) }`
		}

		if (typeof arguments[0] == 'object') {

			this.UPDATE = Object.entries( arguments[0] )
			.map(([key, value]) => `${ key } = ${ this.type(value) }`).join(', ')
		}

		this.QUERY = `UPDATE ${ this.TABLE } SET ${ this.UPDATE }`

		return await this.query()
	}



	async insert(data) {

		let keys = Object.keys(data).join(', ')
		let values = Object.values(data).map(value => this.type(value)).join(', ')

		this.QUERY = `INSERT INTO ${ this.TABLE } (${ keys }) VALUES (${ values })`

		return await this.query()
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

		let data = {

			sql: [],
			columns: []
		}

		Object.entries(structure).forEach(([name, column]) => {

			if (column.Increment)
			data.primarykey = `PRIMARY KEY (${name})`

			data.sql.push([

				name,
				column.Type,
				column.Unique,
				column.Null ? 'NULL' : 'NOT NULL',
				column.Increment,
				column.Collate

			].join(' ').replace(/\s+/g, ' ').trim())

			data.columns.push({

				Field: name,
				Type: column.Type,
				Null: column.Null ? 'NULL' : 'NOT NULL',
				NullCondition: column.Null ? 'YES' : 'NO',

				Key: {
					column: name,
					key: column.Increment ? 'PRIMARY' : column.Unique ? name : undefined
				},

				Previous: data.columns[data.columns.length - 1]
			})
		})



		if (data.primarykey)
		data.sql.push(data.primarykey)



		setTimeout(async () => {

			this.QUERY = `CREATE DATABASE IF NOT EXISTS ${ this.BASE } COLLATE utf8_general_ci`
			await this.query()

			this.QUERY = `CREATE TABLE IF NOT EXISTS ${ this.TABLE } (${ data.sql.join(', ') }) ENGINE = MyISAM COLLATE utf8_general_ci`
			await this.query()

			this.QUERY = `SHOW COLUMNS FROM ${ this.TABLE }`
			let columns = await this.query()

			this.QUERY = `SHOW INDEX FROM ${ this.TABLE }`
			let indexes = await this.query()

			this.alter(data.columns, columns, indexes)
		})

		return this
	}



	async alter(data, columns, indexes) {










		let dataFields = data.map(column => column.Field)
		let baseFields = columns.map(column => column.Field)

		let add = data.filter(data => baseFields.indexOf(data.Field) < 0)
		let drop = columns.filter(data => dataFields.indexOf(data.Field) < 0)

		let addFields = add.map(column => column.Field)
		let exists = data.filter(data => addFields.indexOf(data.Field) < 0)

		let changes = exists.filter(exist => {

			let base = columns.find(column => column.Field == exist.Field)

			if (![

				exist.Type == base.Type,
				exist.NullCondition == base.Null

			].every(condition => condition == true))

			return true
		})










		// drop old columns

		await drop.forEach(async column => {

			this.QUERY = `ALTER TABLE ${ this.TABLE } DROP ${ column.Field }`
			await this.query()
		})



		// add new columns

		await add.forEach(async column => {

			this.QUERY = [

				'ALTER TABLE',
				this.TABLE,
				'ADD',
				column.Field,
				column.Type,
				column.Null,
				column.Previous ? `AFTER ${ column.Previous.Field }` : 'FIRST'

			].join(' ')

			await this.query()
		})



		// changes

		await changes.forEach(async column => {

			this.QUERY = [

				'ALTER TABLE',
				this.TABLE,
				'CHANGE',
				column.Field,
				column.Field,
				column.Type,
				column.Null

			].join(' ')

			await this.query()
		})



		// indexes

		let dataIndexes = data.map(column => column.Key)
		let baseIndexes = indexes.map(column => {

			return { column: column.Column_name, key: column.Key_name }
		})


		await dataIndexes.forEach(async index => {

			let base = Object.assign({ column: undefined, key: undefined},
			baseIndexes.find(baseIndex => baseIndex.column == index.column))

			if (base.key != index.key) {

				if (base.key == 'PRIMARY') {

					this.QUERY = `ALTER TABLE ${ this.TABLE } DROP PRIMARY KEY`
					await this.query()
				}

				if (base.key == index.column) {

					this.QUERY = `ALTER TABLE ${ this.TABLE } DROP INDEX ${ index.column }`
					await this.query()
				}

				if (index.key == 'PRIMARY') {

					this.QUERY = `ALTER TABLE ${ this.TABLE } ADD PRIMARY KEY (${ index.column })`
					await this.query()
				}

				if (index.key == index.column) {

					this.QUERY = `ALTER TABLE ${ this.TABLE } ADD UNIQUE ${ index.column } (${ index.column })`
					await this.query()
				}
			}
		})
	}
}










class Column {

	get increment() { return new ColumnData('int').increment }
	get integer() { return new ColumnData('int') }
	get varchar() { return new ColumnData('varchar(255)').collate }
	get string() { return new ColumnData('text').collate }
}



class ColumnData {



	constructor(type) {

		this.Type = type
	}



	get increment() {

		this.Increment = 'AUTO_INCREMENT'
		return this
	}



	get collate() {

		this.Collate = 'COLLATE utf8_general_ci'
		return this
	}



	get unique() {

		this.Unique = 'UNIQUE'
		return this
	}



	get null() {

		this.Null = true
		return this
	}
}
