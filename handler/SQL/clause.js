


$(SQL.prototype)



.add(function and(...a) {

	this.clause('AND', false, ...a)
	return this
})



.add(function not(...a) {

	this.clause('AND', true, ...a)
	return this
})



.add(function or(...a) {

	this.clause('OR', false, ...a)
	return this
})










.add(function like(column, value) {

	this.CLAUSE.push({

		method: 'OR',
		string: `\`${ column }\` LIKE '%${ value }%'`
	})

	return this
})



.add(function order(column, sort) {

	this.ORDER = `ORDER BY \`${ column }\` ${ sort ? 'ASC' : 'DESC' }`
	return this
})



.add(function limit(offset, count) {

	this.LIMIT = `LIMIT ` + (count ? `${ offset }, ${ count }` : offset)
	return this
})










.add(function clause(method, negative, string, object) {



	let NOT = negative ? 'NOT ' : ''
	let CON = negative ? '<>' : '='



	/*
		1) query (string)
	*/

	if (arguments.length == 3)
	return this.CLAUSE.push({ method: method, string: string })



	/*
		2) column (string), array (object)
	*/

	if (object instanceof Array) {

		let array = object
		.filter(value => value != null)
		.map(value => this.type(value))

		return this.CLAUSE.push({

			method: method,
			string: `\`${ string }\` ${ NOT }IN (${ array.join(', ') })`
		})
	}



	/*
		3) column (string), value (object)
	*/

	let value = object == null ? `IS ${ NOT }NULL` :
	`${ CON } ${ this.type(object) }`

	return this.CLAUSE.push({

		method: method,
		string: `\`${ string }\` ${ value }`
	})
})
