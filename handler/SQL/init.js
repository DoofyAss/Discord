


class COLUMN {



	constructor(options) {

		this.NULL = 'NOT NULL'
		Object.assign(this, options)
	}



	static get COLLATE() {

		return 'COLLATE utf8mb4_general_ci'
	}



	get collate() {

		this.COLLATE = COLUMN.COLLATE
		return this
	}



	get null() {

		this.NULL = 'NULL'
		return this
	}



	get unsigned() {

		this.TYPE += ' unsigned'
		return this
	}



	get unique() {

		this.UNIQUE = 'UNIQUE'
		return this
	}



	key(name) {

		return this.UNIQUE ? name :
		this.INCREMENT ? 'PRIMARY' : undefined
	}



	join(name) {

		return [

			`\`${ name }\``,
			this.TYPE,
			this.NULL,
			this.INCREMENT || this.UNIQUE,
			this.COLLATE

		].filter(e => e).join(' ')
	}
}










$(DB)

.get(function increment() {

	return new COLUMN({ TYPE: 'int', INCREMENT: 'AUTO_INCREMENT' })
})



.get(function boolean() {

	return new COLUMN({ TYPE: 'tinyint' })
})



.get(function integer() {

	return new COLUMN({ TYPE: 'int' })
})



.get(function bigint() {

	return new COLUMN({ TYPE: 'bigint' })
})



.get(function varchar() {

	return new COLUMN({ TYPE: 'varchar(128)' }).collate
})



.get(function text() {

	return new COLUMN({ TYPE: 'text' }).collate
})



.get(function mediumblob() {

	return new COLUMN({ TYPE: 'mediumblob' })
})



.get(function longblob() {

	return new COLUMN({ TYPE: 'longblob' })
})










$(SQL.prototype).add(async function init(struct) {

	let primary = []

	let columns = Object.keys(struct).map(name => {

		if (struct[name].INCREMENT == 'AUTO_INCREMENT')
		primary.push(`PRIMARY KEY (${ name })`)

		return struct[name].join(name)
	})

	await this.query(`CREATE DATABASE IF NOT EXISTS ${ this.BASE } ${ COLUMN.COLLATE }`)

	await this.query(`CREATE TABLE IF NOT EXISTS ${ this.SPACE } (${ columns.concat(primary).join(', ') }) ENGINE = MyISAM ${ COLUMN.COLLATE }`)

	await this.alter(struct)
})










$(SQL.prototype).add(async function alter(struct, data = []) {



	// data collection

	let columns = await this.query(`SHOW COLUMNS FROM ${ this.SPACE }`)
	let indexes = await this.query(`SHOW INDEX FROM ${ this.SPACE }`)

	Object.entries(struct).forEach(([name, column]) => {

		data.push({

			Field: name,
			Type: column.TYPE,
			Null: column.NULL,
			Increment: column.INCREMENT || '',

			index: {

				name: name,
				key: column.key(name),
			},

			base: {

				key: indexes.find(i => i.Column_name == name)?.Key_name
			},

			Previous: data[data.length - 1]
		})
	})



	// drop old columns

	let drop = columns.filter(c => ! data.find(d => d.Field == c.Field))

	for (column of drop)
	await this.query(`ALTER TABLE ${ this.SPACE } DROP \`${ column.Field }\``)



	// add new columns

	let add = data.filter(d => ! columns.find(c => c.Field == d.Field))

	for (column of add) {

		let sql = [

			[
				'ALTER TABLE',
				this.SPACE,
				'ADD',
				`\`${ column.Field }\``,
				column.Type,
				column.Null,
				column.Increment,
				column.Previous ? `AFTER \`${ column.Previous.Field }\`` : 'FIRST'

			].join(' ')
		]

		if (column.Increment) {

			column.base.key = 'PRIMARY'
			sql.push(`ADD PRIMARY KEY (\`${ column.Field }\`)`)
		}

		await this.query( sql.join(', ') )
	}




	// indexes

	for ({ index, base } of data) {

		if (base.key != index.key) {

			if (base.key == 'PRIMARY')
			await this.query(`ALTER TABLE ${ this.SPACE } DROP PRIMARY KEY`)

			if (base.key == index.name)
			await this.query(`ALTER TABLE ${ this.SPACE } DROP INDEX ${ index.name }`)

			if (index.key == 'PRIMARY')
			await this.query(`ALTER TABLE ${ this.SPACE } ADD PRIMARY KEY (${ index.name })`)

			if (index.key == index.name)
			await this.query(`ALTER TABLE ${ this.SPACE } ADD UNIQUE ${ index.name } (${ index.name })`)
		}
	}



	// changes

	let change = data.filter(d => {

		if (c = columns.find(c => c.Field == d.Field)) {

			return ! [

				c.Type == d.Type,
				c.Null == (d.Null == 'NULL' ? 'YES' : 'NO'),
				c.Extra.toUpperCase() == d.Increment

			].every(Boolean)
		}
	})

	for (column of change)
	await this.query([

		'ALTER TABLE',
		this.SPACE,
		'CHANGE',
		`\`${ column.Field }\``,
		`\`${ column.Field }\``,
		column.Type,
		column.Null,
		column.Increment

	].join(' '))
})
