


/*
	QUERY
*/

await DB.query('SHOW DATABASES')



/*
	INIT
*/

await DB('BASE.TABLE').init({

	id: DB.increment, // int NOT NULL AUTO_INCREMENT
	type: DB.varchar.null, // varchar NULL
	name: DB.varchar.unique, // varchar(128) NOT NULL UNIQUE
	date: DB.integer.unsigned, // int NOT NULL
	blob: DB.mediumblob.null // BLOB NULL 16 MB
})



/*
	INSERT
*/

// data will be update if has unique columns

await DB('BASE.TABLE').insert({

	type: 'Bot',
	name: 'Kate'
})



/*
	UPDATE
*/

await DB('BASE.TABLE', 'name', 'Kate').update({

	type: 'BOT',
	name: 'Katelyn'
})



/*
	FETCH
*/

await DB('BASE.TABLE', 1).fetch() // WHERE id = 1
await DB('BASE.TABLE', 'column', 'value').fetch() // WHERE column = value

.and('id <> 1') // WHERE id <> 1

.and('type', 'BOT') // WHERE type = BOT
.and('name', 'Katelyn') // AND name = Katelyn

.not('name', null) // WHERE name IS NOT NULL
.or('id', [1, 2, 3]) // OR id IN (1, 2, 3)

.order('id') // ASC
.order('id', true) // DESC

.limit(5) // LIMIT 0, 5
.limit(5, 10) // LIMIT 5, 10

await DB('BASE.TABLE').fetch(1) // data.shift()
await DB('BASE.TABLE').fetch(3) // LIMIT 3
await DB('BASE.TABLE').fetch(callback)



/*
	DELETE
*/

await DB('BASE.TABLE', 1).delete() // DELETE FROM BASE.TABLE WHERE id = 1
await DB('BASE.TABLE', 1).delete(true) // re-count increment



/*
	DROP
*/

await DB('BASE').drop() // drop BASE
await DB('BASE.TABLE').drop() // drop TABLE
await DB('BASE.TABLE').clear() // clear TABLE
