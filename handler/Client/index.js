


global.client = Object.assign(global.client || {})
global.config = require.main.require('./config')



$(client)



.get(function guild() {

	return client.guilds.cache.get(config.guild)
})










.get(function roles() {

	return {

		everyone: client.guild.roles.everyone,

		boost: client.guild.roles.cache
		.find(r => r.tags?.premiumSubscriberRole) || {},

		member: client.guild.roles.cache
		.filter(r => (!r.tags || r.tags.empty) && r.id != this.id)
	}
})










.add(function info() {

	let start = $.time()

	setInterval(() => {

		let memory = process.memoryUsage()

		let data = [

			client.user ?. username || 'Bot',
			start.left,
			$.size(memory.heapUsed)
		]

		process.title = data.join('   -   ')

	}, 5000)
})










.add(function scan(folder, collection = []) {



	const put = (mod, dir) => {

		let name = (dir || mod).split(path.sep).pop()

		collection.push({ name: name, path: mod })
	}



	fs.existsSync(folder) &&
	fs.readdirSync(folder).forEach(dir => {

		let tmp = path.join(folder, dir)

		if (fs.lstatSync(tmp).isDirectory()) {

			let index = path.join(tmp, 'index.js')
			if (fs.existsSync(index)) put(index, tmp)
		}

		if (tmp.endsWith('.js')) put(tmp)
	})



	return collection
})










.add(async function include(folder) {

	folder = path.join(require.main.path, folder)

	client.scan(folder).each(mod => {

		console.dir(`module { \x1b[33m${ mod.name }\x1b[37m }`)

		require(mod.path).each((name, context) => {

			global[name] = global[name] ?
			Object.assign( global[name], context ) : context
		})
	})
})










global.emoji = {

	get positive() { return [ '😀', '😇', '😉', '😏', '🤓', '😎' ].random },
	get negative() { return [ '😠', '😒', '😬', '🤨', '😤' ].random },
	get neutral() { return [ '😐', '🙄', '😵‍💫', '😶‍🌫️', '🤥' ].random },
	get sad() { return [ '😦', '😕', '🥺', '🤕', '😖', '😭' ].random }
}



global.color = {

	red: 0xdd2e44,
	blue: 0x00a6f5,
	green: 0x2ecc71,
	yellow: 0xfdcb58,

	gray: 0x2b2d31,

	join: 0x8c9dff,
	boost: 0xff73fa
}



require('./application')
