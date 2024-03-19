


global.DataBase = {}



$(global.DB = function DB(space, ...arg) {

	if (arg.length == 2)
	return new SQL(space).and(arg[0], arg[1])

	if (arg.length == 1)
	return new SQL(space).and('id', arg[0])

	return new SQL(space)
})



.add(async function query(request) {

	return await new SQL().query(request)
})



global.SQL = class SQL {



	constructor(space = '.') {

		[ this.BASE, this.TABLE ] = space.split('.')
		this.SPACE = this.TABLE ? space : this.BASE

		this.CLAUSE = []
	}



	get SQL() {

		this.WHERE = this.CLAUSE.map((e, i) =>
		`${ i == 0 ? 'WHERE' : e.method } ${ e.string }`).join(' ')

		return [ this.STATEMENT, this.WHERE, this.ORDER, this.LIMIT ]
		.filter(e => e).join(' ')
	}



	type(value) {



		if (value instanceof Buffer)
		return `X'${ value.toString('hex') }'`



		switch (value) {

			case null:
			case undefined:
			return 'null'
		}



		switch (typeof value) {

			case 'boolean':
			return value ? 1 : 0

			case 'number':
			return parseInt(value)

			case 'string':
			return `'${ value.replace(/['"\\]/gm, '\\$&') }'`

			default:
			return `'${ value }'`
		}
	}



	async query(request) {

		// console.log(request || this.SQL) // debug

		return await new Promise(async resolve => {

			(await DB.connection)
			.query(request || this.SQL, async (err, res) => {

				if (! err)
				return resolve(res)

				return console.err(err)
			})
		})
	}
}



require('./init')
require('./clause')
require('./statement')
require('./connect')
